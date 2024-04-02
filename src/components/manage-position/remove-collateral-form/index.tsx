"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Wallet } from "@4x.pro/components/wallet";
import { getTokenSymbol } from "@4x.pro/configs/dex-platform";
import type { Token } from "@4x.pro/configs/dex-platform";
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
import { Select } from "@4x.pro/ui-kit/select";
import { TokenField } from "@4x.pro/ui-kit/token-field";
import { TokenPrice } from "@4x.pro/ui-kit/token-price";

import type { SubmitData } from "./schema";
import { submitDataSchema } from "./schema";
import { mkRemoveCollateralFormStyles } from "./styles";

const useRemoveCollateralForm = (collateralToken: Token) => {
  return useForm<SubmitData>({
    defaultValues: {
      collateral: {
        withdrawal: 0,
        token: collateralToken,
      },
    },
    resolver: yupResolver(submitDataSchema),
  });
};

type Props = {
  form: UseFormReturn<SubmitData>;
  collateral: number;
  leverage: number;
  entryPrice: number;
  side: "long" | "short";
};

const receiveTokens: readonly Token[] = ["SOL", "USDC", "BTC", "ETH"];

const RemoveCollateralForm: FC<Props> = ({
  form,
  collateral,
  leverage,
  entryPrice,
  side,
}) => {
  const errors = form.formState.errors;
  const removeCollateralFormStyles = mkRemoveCollateralFormStyles();
  const collateralToken = useWatch({
    control: form.control,
    name: "collateral.token",
  });
  const withdrawal = useWatch({
    control: form.control,
    name: "collateral.withdrawal",
  });
  const size = collateral * leverage;
  const collateralAfterWithdraw = collateral - withdrawal || undefined;
  const leverageAfterWithdraw = collateralAfterWithdraw
    ? size / collateralAfterWithdraw
    : undefined;
  const liquidationPrice = calculateLiquidationPrice(
    entryPrice,
    leverage,
    0.1,
    side === "long",
  );
  const { connected } = useWallet();
  const liquidationPriceAfterWithdraw = leverageAfterWithdraw
    ? calculateLiquidationPrice(
        entryPrice,
        leverageAfterWithdraw,
        0.1,
        side === "long",
      )
    : undefined;
  const handleSubmit = form.handleSubmit((data) => {
    alert(JSON.stringify(data));
  });
  const mkHandleFieldChange =
    (onChange: (data: { withdrawal: number; token: Token }) => void) =>
    (data: { amount: number }) => {
      const token = form.getValues("collateral.token");
      onChange({ withdrawal: data.amount, token });
    };
  const mkHandleRangeChange =
    (onChange: (data: { withdrawal: number; token: Token }) => void) =>
    (percentage: number) => {
      const token = form.getValues("collateral.token");
      onChange({ withdrawal: (collateral / 100) * percentage, token });
    };
  const mkHandleSelectChange =
    (onChange: (data: { withdrawal: number; token: Token }) => void) =>
    (token: string) => {
      const withdrawal = form.getValues("collateral.withdrawal");
      onChange({ withdrawal, token: token as Token });
    };
  const isInsufficientBalance = withdrawal > collateral;
  return (
    <form onSubmit={handleSubmit} className={removeCollateralFormStyles.root}>
      <fieldset className={removeCollateralFormStyles.fieldset}>
        <Controller<SubmitData, "collateral">
          name="collateral"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <TokenField
              label="Withdraw"
              value={value.withdrawal || ""}
              token={collateralToken}
              max={collateral}
              placeholder="0.00"
              labelVariant="max"
              onChange={mkHandleFieldChange(onChange)}
              error={!!errors.collateral?.withdrawal}
              showPostfix
              showPresets
            />
          )}
        />
        <Controller<SubmitData, "collateral">
          name="collateral"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <RangeSlider
              value={(value.withdrawal / collateral) * 100}
              min={0}
              max={100}
              step={1}
              formatValue={formatPercentage}
              onChange={mkHandleRangeChange(onChange)}
            />
          )}
        />
      </fieldset>
      <dl className={removeCollateralFormStyles.statsList}>
        <Definition
          term="Receive"
          content={
            <Controller<SubmitData, "collateral">
              name="collateral"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <Select
                  inline
                  options={receiveTokens.map((token) => ({
                    value: token,
                    content: (
                      <>
                        <TokenPrice
                          token={collateralToken}
                          currency={token}
                          watch
                        >
                          {withdrawal}
                        </TokenPrice>{" "}
                        (
                        <TokenPrice token={collateralToken} watch>
                          {withdrawal}
                        </TokenPrice>
                        )
                      </>
                    ),
                  }))}
                  popoverPosition="right"
                  value={value.token}
                  onChange={mkHandleSelectChange(onChange)}
                />
              )}
            />
          }
        />
        <Definition
          term={`Size (${getTokenSymbol(collateralToken)})`}
          content={size}
        />
        <Definition
          term={`Collateral (${getTokenSymbol(collateralToken)})`}
          content={
            <Comparison initial={collateral} final={collateralAfterWithdraw} />
          }
        />
        <Definition
          term="Leverage"
          content={
            <Comparison
              initial={leverage}
              final={
                Number.isFinite(leverageAfterWithdraw)
                  ? leverageAfterWithdraw
                  : undefined
              }
              formatValue={formatRate}
            />
          }
        />
        <Definition
          term="Liquidation Price"
          content={
            <Comparison
              initial={liquidationPrice}
              final={liquidationPriceAfterWithdraw}
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
          {withdrawal > 0 ? "Remove collateral" : "Enter amount"}
        </Button>
      )}
    </form>
  );
};

export { RemoveCollateralForm, useRemoveCollateralForm };
