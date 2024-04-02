"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";

import { getTokenSymbol } from "@4x.pro/configs/dex-platform";
import type { Token } from "@4x.pro/configs/dex-platform";
import { useTokenBalance } from "@4x.pro/shared/hooks/use-token-balance";
import {
  calculateLiquidationPrice,
  formatCurrency_USD,
  formatPercentage,
  formatRate,
} from "@4x.pro/shared/utils/number";
import { Button } from "@4x.pro/ui-kit/button";
import { Comparison } from "@4x.pro/ui-kit/comparison";
import { Definition } from "@4x.pro/ui-kit/definition";
import { RangeSlider } from "@4x.pro/ui-kit/range-slider";
import { TokenField } from "@4x.pro/ui-kit/token-field";

import type { SubmitData } from "./schema";
import { submitDataSchema } from "./schema";
import { mkAddCollateralFormStyles } from "./styles";
import { Wallet } from "../../wallet";

const useAddCollateralForm = (collateralToken: Token) => {
  return useForm<SubmitData>({
    defaultValues: {
      collateral: {
        deposit: 0,
        token: collateralToken,
      },
    },
    resolver: yupResolver(submitDataSchema),
  });
};

type Props = {
  entryPrice: number;
  collateral: number;
  leverage: number;
  side: "long" | "short";
  form: UseFormReturn<SubmitData>;
};

const AddCollateralForm: FC<Props> = ({
  entryPrice,
  collateral,
  leverage,
  side,
  form,
}) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const addCollateralFormStyles = mkAddCollateralFormStyles();
  const collateralToken = useWatch({
    control: form.control,
    name: "collateral.token",
  });
  const deposit = useWatch({
    control: form.control,
    name: "collateral.deposit",
  });
  const { data: collateralBalance } = useTokenBalance(connection)({
    variables: {
      token: collateralToken,
      account: publicKey?.toBase58(),
    },
  });
  const { connected } = useWallet();
  const errors = form.formState.errors;
  const size = collateral * leverage;
  const collateralAfterDeposit = collateral + deposit;
  const leverageAfterDeposit = size / collateralAfterDeposit;
  const sizeAfterWithdraw =
    collateralAfterDeposit > size ? collateralAfterDeposit : size;
  const liquidationPrice = calculateLiquidationPrice(
    entryPrice,
    leverage,
    0.1,
    side === "long",
  );
  const liquidationPriceAfterDeposit = calculateLiquidationPrice(
    entryPrice,
    leverageAfterDeposit,
    0.1,
    side === "long",
  );
  const handleSubmit = form.handleSubmit((data) => {
    alert(JSON.stringify(data));
  });
  const mkHandleFieldChange =
    (onChange: (data: { deposit: number; token: Token }) => void) =>
    (data: { amount: number; token: Token }) => {
      onChange({ deposit: data.amount, token: data.token });
    };
  const mkHandleRangeChange =
    (onChange: (data: { deposit: number; token: Token }) => void) =>
    (percentage: number) => {
      if (typeof collateralBalance === "number") {
        const token = form.getValues("collateral.token");
        onChange({
          deposit: (collateralBalance / 100) * percentage,
          token,
        });
      }
    };
  const isInsufficientBalance = deposit > (collateralBalance || 0);
  return (
    <form onSubmit={handleSubmit} className={addCollateralFormStyles.root}>
      <fieldset className={addCollateralFormStyles.fieldset}>
        <Controller<SubmitData, "collateral">
          name="collateral"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <TokenField
              value={value.deposit || ""}
              token={value.token}
              onChange={mkHandleFieldChange(onChange)}
              label="Deposit"
              placeholder="0.00"
              labelVariant="balance"
              error={!!errors.collateral?.deposit}
              showPresets
              showPostfix
            />
          )}
        />
        <Controller<SubmitData, "collateral">
          name="collateral"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <RangeSlider
              value={
                collateralBalance
                  ? (value.deposit / collateralBalance) * 100
                  : undefined
              }
              step={1}
              formatValue={formatPercentage}
              onChange={mkHandleRangeChange(onChange)}
            />
          )}
        />
      </fieldset>
      <dl className={addCollateralFormStyles.statsList}>
        <Definition
          term={`Size (${getTokenSymbol(collateralToken)})`}
          content={<Comparison initial={size} final={sizeAfterWithdraw} />}
        />
        <Definition
          term={`Collateral (${getTokenSymbol(collateralToken)})`}
          content={
            <Comparison initial={collateral} final={collateralAfterDeposit} />
          }
        />
        <Definition
          term="Leverage"
          content={
            <Comparison
              initial={leverage}
              final={leverageAfterDeposit}
              formatValue={formatRate}
            />
          }
        />
        <Definition
          term="Liquidation Price"
          content={
            <Comparison
              initial={liquidationPrice}
              final={liquidationPriceAfterDeposit}
              formatValue={formatCurrency_USD}
            />
          }
        />
      </dl>
      {!connected ? (
        <Wallet.Connect variant="accent" size="lg" />
      ) : (
        <Button
          type="submit"
          variant="accent"
          disabled={isInsufficientBalance}
          size="lg"
        >
          {deposit > 0 ? "Add collateral" : "Enter amount"}
        </Button>
      )}
    </form>
  );
};

export { AddCollateralForm, useAddCollateralForm };
