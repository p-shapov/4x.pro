"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";

import { getTokenSymbol } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";
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

const useAddCollateralForm = () => {
  return useForm<SubmitData>({
    defaultValues: {
      depositAmount: 0,
    },
    resolver: yupResolver(submitDataSchema),
  });
};

type Props = {
  entryPrice: number;
  collateral: number;
  collateralToken: Token;
  leverage: number;
  side: "long" | "short";
  form: UseFormReturn<SubmitData>;
};

const AddCollateralForm: FC<Props> = ({
  entryPrice,
  collateral,
  leverage,
  side,
  collateralToken,
  form,
}) => {
  const { publicKey } = useWallet();
  const addCollateralFormStyles = mkAddCollateralFormStyles();
  const depositAmount = useWatch({
    control: form.control,
    name: "depositAmount",
  });
  const { data: collateralBalance } = useTokenBalance({
    token: collateralToken,
    account: publicKey?.toBase58(),
  });
  const { connected } = useWallet();
  const errors = form.formState.errors;
  const size = collateral * leverage;
  const collateralAfterDeposit = collateral + depositAmount;
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
    (onChange: (depositAmount: number) => void) =>
    ({ amount }: { amount: number }) => {
      onChange(amount);
    };
  const mkHandleRangeChange =
    (onChange: (percentage: number) => void) => (percentage: number) => {
      if (typeof collateralBalance === "number") {
        onChange((collateralBalance / 100) * percentage);
      }
    };
  const isInsufficientBalance = depositAmount > (collateralBalance || 0);
  return (
    <form onSubmit={handleSubmit} className={addCollateralFormStyles.root}>
      <fieldset className={addCollateralFormStyles.fieldset}>
        <Controller<SubmitData, "depositAmount">
          name="depositAmount"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <TokenField
              value={value || ""}
              token={collateralToken}
              onChange={mkHandleFieldChange(onChange)}
              label="Deposit"
              placeholder="0.00"
              labelVariant="balance"
              error={!!errors.depositAmount}
              showPresets
              showPostfix
            />
          )}
        />
        <Controller<SubmitData, "depositAmount">
          name="depositAmount"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <RangeSlider
              value={
                collateralBalance
                  ? (value / collateralBalance) * 100
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
          {depositAmount > 0 ? "Add collateral" : "Enter amount"}
        </Button>
      )}
    </form>
  );
};

export { AddCollateralForm, useAddCollateralForm };
