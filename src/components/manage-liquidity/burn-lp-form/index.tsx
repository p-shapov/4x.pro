"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import type { Token } from "@4x.pro/app-config";
import { Wallet } from "@4x.pro/components/wallet";
import { useChangeLiquidity } from "@4x.pro/services/perpetuals/hooks/use-change-liquidity";
import { useRemoveLiquidityStats } from "@4x.pro/services/perpetuals/hooks/use-remove-liquidity-stats";
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
import { mkBurnLPFormStyles } from "./styles";

type Props = {
  pool: PoolAccount;
  form: UseFormReturn<SubmitData>;
};

const useBurnLPForm = () => {
  return useForm<SubmitData>({
    defaultValues: {
      receiveToken: "USDC",
      slippage: 0.5,
    },
    resolver: yupResolver(submitDataSchema),
  });
};

const BurnLPForm: FC<Props> = ({ pool, form }) => {
  const changeLiquidity = useChangeLiquidity();
  const handleSubmit = form.handleSubmit(async (data) => {
    if (!removeLiquidityStats.data) {
      return messageToast("No stats found", "error");
    } else if (!custody) {
      return messageToast("No custody found", "error");
    }
    {
      try {
        messageToast("Transaction submitted", "success");
        await changeLiquidity.mutateAsync({
          type: "remove-liquidity",
          tokenAmount: removeLiquidityStats.data?.amount || 0,
          liquidityAmount: data.lpAmount,
          pool,
          custody,
        });
      } catch (e) {
        console.error(e);
      }
    }
  });
  const burnLPFormStyles = mkBurnLPFormStyles();
  const mkHandleChangeLP =
    (onChange: (value: number) => void) =>
    (data: { amount: number; token: Token }) => {
      onChange(data.amount);
    };
  const mkHandleChangeReceive =
    (onChange: (value: Token) => void) =>
    (data: { amount: number; token: Token }) => {
      onChange(data.token);
    };
  const walletContextState = useWallet();
  const lpAmount = useWatch({
    control: form.control,
    name: "lpAmount",
  });
  const receiveToken = useWatch({
    control: form.control,
    name: "receiveToken",
  });
  const custody = pool.getCustodyAccount(receiveToken);
  const { data: lpBalance } = useTokenBalance({
    token: receiveToken,
    account: walletContextState.publicKey,
  });
  const isInsufficientLPBalance = useIsInsufficientBalance({
    token: "LP",
    amount: lpAmount,
    address: pool?.getLpTokenMint(),
  });
  const removeLiquidityStats = useRemoveLiquidityStats({
    amount: lpAmount,
    pool,
    custody,
  });
  const errors = form.formState.errors;
  return (
    <form onSubmit={handleSubmit} noValidate className={burnLPFormStyles.root}>
      <Controller<SubmitData, "lpAmount">
        control={form.control}
        name="lpAmount"
        render={({ field: { onChange, value } }) => (
          <TokenField
            value={value}
            token="LP"
            label="Pay"
            placeholder="0.00"
            labelVariant="balance"
            onChange={mkHandleChangeLP(onChange)}
            presets={[25, 50, 75, 100]}
            poolTokenAddress={pool?.getLpTokenMint()}
            tokenList={["LP"]}
            formatPresets={(value) => formatPercentage(value, 0)}
            mapPreset={(value) => (lpBalance || 0) * (value / 100)}
            error={!!errors.lpAmount}
          />
        )}
      />
      <Controller<SubmitData, "receiveToken">
        control={form.control}
        name="receiveToken"
        render={({ field: { value, onChange } }) => (
          <TokenField
            value={roundToFirstNonZeroDecimal(
              removeLiquidityStats.data?.amount || 0,
            )}
            token={value}
            label="Receive"
            readonlyAmount
            tokenList={["USDC", "SOL", "BTC"]}
            onChange={mkHandleChangeReceive(onChange)}
            labelVariant="balance"
            placeholder="0.00"
          />
        )}
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
      <dl className={burnLPFormStyles.stats}>
        <Definition
          term="Fees"
          content={formatCurrency_USD(removeLiquidityStats.data?.fee, 2)}
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
          disabled={isInsufficientLPBalance.data}
        >
          Burn
        </Button>
      )}
    </form>
  );
};

export { BurnLPForm, useBurnLPForm };
