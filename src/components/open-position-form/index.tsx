"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";

import type { Token } from "@4x.pro/app-config";
import { useOpenPosition } from "@4x.pro/services/perpetuals/hooks/use-open-position";
import { usePools } from "@4x.pro/services/perpetuals/hooks/use-pools";
import { useUserPositions } from "@4x.pro/services/perpetuals/hooks/use-positions";
import { Side } from "@4x.pro/services/perpetuals/lib/types";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-connection";
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
import { Wallet } from "../wallet";

type Props = {
  form: UseFormReturn<SubmitData>;
  side: "short" | "long";
  collateralTokens: readonly Token[];
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

const OpenPositionForm: FC<Props> = ({ side, form, collateralTokens }) => {
  const openPositionFormStyles = mkOpenPositionFormStyles();
  const walletContextState = useWallet();
  const openPosition = useOpenPosition();
  const pools = usePools();
  const pool = Object.values(pools.data || {})[0];
  const quoteToken = useWatch({
    control: form.control,
    name: "position.quote.token",
  });
  const positions = useUserPositions();
  const hasPosition = Object.values(positions.data || {}).some(
    (position) =>
      position.token === quoteToken &&
      position.side.toString().toLowerCase() === side,
  );
  const handleSubmit = form.handleSubmit(async (data) => {
    if (hasPosition) {
      messageToast("You already have an open position", "error");
    } else if (!(priceData?.price && pool)) {
      messageToast("Price data is not available", "error");
    } else {
      try {
        messageToast("Transaction submitted", "success");
        await openPosition.mutateAsync({
          walletContextState,
          pool,
          payAmount: data.position.base.size,
          payToken: data.position.base.token,
          positionAmount: data.position.quote.size,
          positionToken: data.position.quote.token,
          leverage: data.leverage,
          price: priceData.price,
          side: side === "long" ? Side.Long : Side.Short,
          slippage: data.slippage,
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
  const { priceData } = useWatchPythPriceFeed(positionQuote.token);
  const { connected } = useWallet();
  const isInsufficientBalance = useIsInsufficientBalance({
    token: positionBase.token,
    amount: positionBase.size,
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
      <Position form={form} collateralTokens={collateralTokens} />
      <Leverage form={form} />
      <Slippage form={form} />
      <TriggerPrice form={form} />
      {!connected ? (
        <Wallet.Connect variant={getButtonVariant()} />
      ) : (
        <Button
          type={connected ? "submit" : "button"}
          variant={getButtonVariant()}
          disabled={isInsufficientBalance.data}
          loading={openPosition.isPending}
        >
          {getTitle()}
        </Button>
      )}
    </form>
  );
};

export { OpenPositionForm, useOpenPositionForm, OpenPositionFormProvider };
