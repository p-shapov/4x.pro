"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWallet } from "@solana/wallet-adapter-react";
import dayjs from "dayjs";
import { useDeferredValue } from "react";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";

import { useEntryPriceStats } from "@4x.pro/services/perpetuals/hooks/use-entry-price-stats";
import { useOpenPosition } from "@4x.pro/services/perpetuals/hooks/use-open-position";
import { usePositions } from "@4x.pro/services/perpetuals/hooks/use-positions";
import { useLogTransaction } from "@4x.pro/services/perpetuals/hooks/use-transaction-history";
import type { PoolAccount } from "@4x.pro/services/perpetuals/lib/pool-account";
import type { PositionSide } from "@4x.pro/services/perpetuals/lib/types";
import { useIsInsufficientBalance } from "@4x.pro/shared/hooks/use-token-balance";
import { Button } from "@4x.pro/ui-kit/button";
import { messageToast } from "@4x.pro/ui-kit/message-toast";

import { Leverage } from "./leverage";
import { Position } from "./position";
import { OpenPositionFormProvider } from "./provider";
import type { SubmitData } from "./schema";
import { submitDataSchema } from "./schema";
import { Slippage } from "./slippage";
import { mkOpenPositionFormStyles } from "./styles";
import { TriggerPrice } from "./trigger-price";
import { Wallet } from "../../wallet";

type Props = {
  pool: PoolAccount;
  form: UseFormReturn<SubmitData>;
  side: PositionSide;
};

const useOpenPositionForm = () => {
  const form = useForm<SubmitData>({
    defaultValues: {
      leverage: 1.1,
      slippage: 0.5,
      position: {
        base: {
          token: "USDC",
          size: 0,
        },
        quote: {
          token: "SOL",
          size: 0,
        },
      },
    },
    resolver: yupResolver(submitDataSchema),
  });
  return form;
};

const OpenPositionForm: FC<Props> = ({ pool, side, form }) => {
  const logTransaction = useLogTransaction();
  const openPositionFormStyles = mkOpenPositionFormStyles();
  const walletContextState = useWallet();
  const openPosition = useOpenPosition();
  const quoteToken = useWatch({
    control: form.control,
    name: "position.quote.token",
  });
  const positions = usePositions({ owner: walletContextState.publicKey });
  const hasPosition = Object.values(positions.data || {}).some(
    (position) =>
      position.token === quoteToken &&
      position.side.toString().toLowerCase() === side,
  );
  const handleSubmit = form.handleSubmit(async (data) => {
    const price = priceStats?.entryPrice;
    if (isInsufficientBalance.data) {
      messageToast("Insufficient balance", "error");
    } else if (hasPosition) {
      messageToast("You already have an open position", "error");
    } else if (!price) {
      messageToast("Price data is not available", "error");
    } else if (
      (pool
        .getCustodyAccount(data.position.quote.token)
        ?.getCustodyLiquidity(price) || 0) <
      data.position.quote.size * price
    ) {
      messageToast("Insufficient liquidity", "error");
    } else {
      try {
        messageToast("Transaction submitted", "success");
        const txid = await openPosition.mutateAsync({
          pool,
          price,
          side,
          payAmount: data.position.base.size,
          payToken: data.position.base.token,
          positionAmount: data.position.quote.size,
          positionToken: data.position.quote.token,
          leverage: data.leverage,
          slippage: data.slippage,
          stopLoss: data.stopLoss || null,
          takeProfit: data.takeProfit || null,
        });
        await logTransaction.mutateAsync({
          txid,
          token: data.position.quote.token,
          time: dayjs().utc(false).unix(),
          type: "open-position",
          txData: {
            side,
            price,
            fee: priceStats?.fee,
            leverage: data.leverage,
            collateral: data.position.quote.size,
            size: data.position.quote.size * data.leverage,
          },
        });
      } catch (e) {
        console.error(e);
      }
    }
  });
  const positionBase = useWatch({
    control: form.control,
    name: "position.base",
  });
  const positionQuote = useWatch({
    control: form.control,
    name: "position.quote",
  });
  const isInsufficientBalance = useIsInsufficientBalance({
    token: positionBase.token,
    amount: positionBase.size,
  });
  const leverage = useWatch({
    control: form.control,
    name: "leverage",
  });
  const size = positionQuote.size * leverage;
  const { data: priceStats } = useEntryPriceStats({
    pool,
    side,
    collateralToken: positionQuote.token,
    size: useDeferredValue(size),
    collateral: useDeferredValue(positionQuote.size),
  });
  const getTitle = () => {
    switch (side) {
      case "long":
        return "Long / Buy";
      case "short":
        return "Short / Sell";
    }
  };
  const getButtonVariant = () => {
    switch (side) {
      case "long":
        return "primary";
      case "short":
        return "red";
    }
  };
  return (
    <form
      className={openPositionFormStyles.root}
      onSubmit={handleSubmit}
      noValidate
    >
      <Position pool={pool} form={form} side={side} />
      <Leverage form={form} />
      <Slippage form={form} />
      <TriggerPrice form={form} />
      {!walletContextState.connected ? (
        <Wallet.Connect variant={getButtonVariant()} />
      ) : (
        <Button
          type="submit"
          variant={getButtonVariant()}
          loading={openPosition.isPending}
        >
          {getTitle()}
        </Button>
      )}
    </form>
  );
};

export { OpenPositionForm, useOpenPositionForm, OpenPositionFormProvider };
