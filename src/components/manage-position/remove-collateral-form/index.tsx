"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";

import { getTokenSymbol } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";
import { Wallet } from "@4x.pro/components/wallet";
import { useChangeCollateral } from "@4x.pro/services/perpetuals/hooks/use-change-collateral";
import { usePools } from "@4x.pro/services/perpetuals/hooks/use-pools";
import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { Side, Tab } from "@4x.pro/services/perpetuals/lib/types";
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

const useRemoveCollateralForm = (receiveToken: Token) => {
  return useForm<SubmitData>({
    defaultValues: {
      receiveToken,
      withdrawalAmount: 0,
    },
    resolver: yupResolver(submitDataSchema),
  });
};

type Props = {
  position: PositionAccount;
  form: UseFormReturn<SubmitData>;
};

const receiveTokens: readonly Token[] = ["SOL", "USDC", "BTC", "ETH"];

const RemoveCollateralForm: FC<Props> = ({ position, form }) => {
  const walletContextState = useWallet();
  const collateral = position.collateralAmount.toNumber() / LAMPORTS_PER_SOL;
  const entryPrice = position.getPrice();
  const collateralToken = position.token;
  const leverage = position.getLeverage();
  const side = position.side === Side.Long ? "long" : "short";
  const errors = form.formState.errors;
  const removeCollateralFormStyles = mkRemoveCollateralFormStyles();
  const withdrawalAmount = useWatch({
    control: form.control,
    name: "withdrawalAmount",
  });
  const size = collateral * leverage;
  const collateralAfterWithdraw = collateral - withdrawalAmount || undefined;
  const leverageAfterWithdraw = collateralAfterWithdraw
    ? size / collateralAfterWithdraw
    : undefined;
  const liquidationPrice = calculateLiquidationPrice(
    entryPrice,
    leverage,
    0.1,
    side === "long",
  );
  const liquidationPriceAfterWithdraw = leverageAfterWithdraw
    ? calculateLiquidationPrice(
        entryPrice,
        leverageAfterWithdraw,
        0.1,
        side === "long",
      )
    : undefined;
  const { data: poolsData } = usePools();
  const pool = Object.values(poolsData || {})[0];
  const changeCollateral = useChangeCollateral();
  const handleSubmit = form.handleSubmit(async (data) => {
    if (pool) {
      try {
        await changeCollateral.mutateAsync({
          collatNum: data.withdrawalAmount * entryPrice,
          tab: Tab.Remove,
          walletContextState,
          position,
          pool,
        });
      } catch (e) {
        console.error(e);
      }
    }
  });
  const mkHandleFieldChange =
    (onChange: (withdrawalAmount: number) => void) =>
    (data: { amount: number }) => {
      onChange(data.amount);
    };
  const mkHandleRangeChange =
    (onChange: (withdrawalAmount: number) => void) => (percentage: number) => {
      onChange((collateral / 100) * percentage);
    };
  const mkHandleSelectChange =
    (onChange: (receiveToken: Token) => void) => (token: string) => {
      onChange(token as Token);
    };
  const isInsufficientBalance = withdrawalAmount > collateral;
  return (
    <form
      onSubmit={handleSubmit}
      className={removeCollateralFormStyles.root}
      noValidate
    >
      <fieldset className={removeCollateralFormStyles.fieldset}>
        <Controller<SubmitData, "withdrawalAmount">
          name="withdrawalAmount"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <TokenField
              label="Withdraw"
              value={value || ""}
              token={collateralToken}
              max={collateral}
              placeholder="0.00"
              labelVariant="max"
              onChange={mkHandleFieldChange(onChange)}
              error={!!errors.withdrawalAmount}
              showPostfix
              showPresets
            />
          )}
        />
        <Controller<SubmitData, "withdrawalAmount">
          name="withdrawalAmount"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <RangeSlider
              value={(value / collateral) * 100}
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
            <Controller<SubmitData, "receiveToken">
              name="receiveToken"
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
                          {withdrawalAmount}
                        </TokenPrice>{" "}
                        (
                        <TokenPrice token={collateralToken} watch>
                          {withdrawalAmount}
                        </TokenPrice>
                        )
                      </>
                    ),
                  }))}
                  popoverPosition="right"
                  value={value}
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
      {!walletContextState.connected ? (
        <Wallet.Connect variant="accent" size="lg" />
      ) : (
        <Button
          type="submit"
          variant="accent"
          disabled={isInsufficientBalance}
          size="lg"
          loading={changeCollateral.isPending}
        >
          {withdrawalAmount > 0 ? "Remove collateral" : "Enter amount"}
        </Button>
      )}
    </form>
  );
};

export { RemoveCollateralForm, useRemoveCollateralForm };
