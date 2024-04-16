"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import { coinList } from "@4x.pro/app-config";
import type { Coin } from "@4x.pro/app-config";
import { Wallet } from "@4x.pro/components/wallet";
import { useAddLiquidityStats } from "@4x.pro/services/perpetuals/hooks/use-add-liquidity-stats";
import { useChangeLiquidity } from "@4x.pro/services/perpetuals/hooks/use-change-liquidity";
import type { PoolAccount } from "@4x.pro/services/perpetuals/lib/pool-account";
import {
  useIsInsufficientBalance,
  useTokenBalance,
} from "@4x.pro/shared/hooks/use-token-balance";
import {
  formatCurrency_USD,
  formatPercentage,
  roundToFirstNonZeroDecimal,
} from "@4x.pro/shared/utils/number";
import { Button } from "@4x.pro/ui-kit/button";
import { Definition } from "@4x.pro/ui-kit/definition";
import { messageToast } from "@4x.pro/ui-kit/message-toast";
import { NumberField } from "@4x.pro/ui-kit/number-field";
import { TokenField } from "@4x.pro/ui-kit/token-field";

import { submitDataSchema } from "./shema";
import type { SubmitData } from "./shema";
import { mkMintLPFormStyles } from "./styles";

type Props = {
  pool: PoolAccount;
  form: UseFormReturn<SubmitData>;
};

const useMintLPForm = () => {
  return useForm<SubmitData>({
    defaultValues: {
      pay: {
        amount: 0,
        token: "USDC",
      },
      slippage: 0.5,
    },
    resolver: yupResolver(submitDataSchema),
  });
};

const MintLPForm: FC<Props> = ({ pool, form }) => {
  const changeLiquidity = useChangeLiquidity();
  const handleSubmit = form.handleSubmit(async (data) => {
    if (isInsufficientPayBalance.data) {
      return messageToast("Insufficient balance", "error");
    } else if (!custody) {
      return messageToast("No custody found", "error");
    } else {
      try {
        messageToast("Transaction submitted", "success");
        await changeLiquidity.mutateAsync({
          type: "add-liquidity",
          tokenAmount: data.pay.amount,
          liquidityAmount: addLiquidityStats.data?.amount || 0,
          pool,
          custody,
        });
      } catch (e) {
        console.error(e);
      }
    }
  });
  const mintLPFormStyles = mkMintLPFormStyles();
  const mkHandleChangePay =
    (onChange: (data: { amount: number; token: Coin }) => void) =>
    (data: { amount: number; token: Coin }) => {
      onChange({
        amount: data.amount,
        token: data.token,
      });
    };
  const walletContextState = useWallet();
  const payAmount = useWatch({
    control: form.control,
    name: "pay.amount",
  });
  const payToken = useWatch({
    control: form.control,
    name: "pay.token",
  });
  const custody = pool?.getCustodyAccount(payToken);
  const { data: payBalance } = useTokenBalance({
    token: payToken,
    account: walletContextState.publicKey,
  });
  const addLiquidityStats = useAddLiquidityStats({
    amount: payAmount,
    pool,
    custody,
  });
  const isInsufficientPayBalance = useIsInsufficientBalance({
    token: payToken,
    amount: payAmount,
  });
  const errors = form.formState.errors;
  return (
    <form onSubmit={handleSubmit} noValidate className={mintLPFormStyles.root}>
      <Controller<SubmitData, "pay">
        control={form.control}
        name="pay"
        render={({ field: { onChange, value: data } }) => (
          <TokenField
            value={data.amount}
            token={data.token}
            label="Pay"
            placeholder="0.00"
            labelVariant="balance"
            onChange={mkHandleChangePay(onChange)}
            presets={[25, 50, 75, 100]}
            tokenList={coinList}
            formatPresets={(value) => formatPercentage(value, 0)}
            mapPreset={(value) => (payBalance || 0) * (value / 100)}
            error={!!(errors.pay?.amount || errors.pay?.token)}
          />
        )}
      />
      <TokenField
        value={roundToFirstNonZeroDecimal(addLiquidityStats.data?.amount || 0)}
        token="LP"
        label="Receive"
        tokenList={["LP"]}
        readonlyAmount
        poolTokenAddress={pool?.getLpTokenMint()}
        labelVariant="balance"
        placeholder="0.00"
      />
      <Controller<SubmitData, "slippage">
        control={form.control}
        name="slippage"
        render={({ field: { value, onChange } }) => (
          <NumberField
            value={value}
            label="Slippage Tolerance"
            placeholder="0.00"
            onChange={onChange}
            unit="%"
            formatValue={(value) => formatPercentage(value, 1)}
            presets={[0.1, 0.5, 0.8]}
            error={!!errors.slippage}
          />
        )}
      />
      <dl className={mintLPFormStyles.stats}>
        <Definition
          term="Fees"
          content={formatCurrency_USD(addLiquidityStats.data?.fee, 2)}
        />
      </dl>
      {!walletContextState.connected ? (
        <Wallet.Connect size="lg" variant="accent" />
      ) : (
        <Button
          type="submit"
          variant="accent"
          size="lg"
          loading={changeLiquidity.isPending}
        >
          Mint
        </Button>
      )}
    </form>
  );
};

export { MintLPForm, useMintLPForm };
