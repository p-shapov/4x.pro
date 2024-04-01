"use client";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";

import type { Token } from "@4x.pro/configs/dex-platform";
import {
  getTokenSymbol,
  useDexPlatformConfig,
} from "@4x.pro/configs/dex-platform";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-price-feed";
import {
  calculateLiquidationPrice,
  calculatePnL,
  formatCurrency_USD,
  formatRate,
} from "@4x.pro/shared/utils/number";
import { Button } from "@4x.pro/ui-kit/button";
import { Comparison } from "@4x.pro/ui-kit/comparison";
import { Definition } from "@4x.pro/ui-kit/definition";
import { NumberField } from "@4x.pro/ui-kit/number-field";

import type { SubmitData } from "./schema";
import { mkTakeProfitFormStyles } from "./styles";

type Props = {
  form: UseFormReturn<SubmitData>;
  side: "long" | "short";
  entryPrice: number;
  triggerPrice?: number;
  collateral: number;
  collateralToken: Token;
  leverage: number;
};

const useTakeProfitForm = (triggerPrice: number = 0) => {
  return useForm<SubmitData>({
    defaultValues: {
      triggerPrice,
    },
  });
};

const TakeProfitForm: FC<Props> = ({
  form,
  side,
  entryPrice,
  triggerPrice = 0,
  collateral,
  collateralToken,
  leverage,
}) => {
  const takeProfitFormStyles = mkTakeProfitFormStyles();
  const newTriggerPrice = useWatch({
    control: form.control,
    name: "triggerPrice",
  });
  const pythConnection = useDexPlatformConfig((state) => state.pythConnection);
  const { price: marketPrice } =
    useWatchPythPriceFeed(pythConnection)(collateralToken).priceData || {};
  const size = collateral * leverage;
  const liquidationPrice = calculateLiquidationPrice(
    entryPrice,
    leverage,
    0.1,
    side === "long",
  );
  const mkHandleChange =
    (onChange: (value: number) => void) => (value: number | "") => {
      onChange(value || 0);
    };
  const errors = form.formState.errors;
  const estimatedPnL = newTriggerPrice
    ? calculatePnL(entryPrice, newTriggerPrice, size, side === "long")
    : undefined;
  return (
    <form className={takeProfitFormStyles.root}>
      <Controller<SubmitData, "triggerPrice">
        name="triggerPrice"
        control={form.control}
        render={({ field: { value, onChange } }) => (
          <NumberField
            label={`Stop Loss Price: ${formatCurrency_USD(newTriggerPrice)}`}
            postfix="$"
            placeholder="0.00"
            value={value || ""}
            onChange={mkHandleChange(onChange)}
            error={!!errors.triggerPrice}
          />
        )}
      />
      <dl className={takeProfitFormStyles.statsList}>
        <Definition
          term="Mark price"
          content={formatCurrency_USD(marketPrice)}
        />
        <Definition
          term="Estimated PnL"
          content={formatCurrency_USD(estimatedPnL)}
        />
        <Definition
          term="TriggerPrice"
          content={
            <Comparison
              initial={triggerPrice}
              final={newTriggerPrice}
              formatValue={formatCurrency_USD}
            />
          }
        />
        <Definition
          term={`Size (${getTokenSymbol(collateralToken)})`}
          content={size}
        />
        <Definition
          term={`Collateral (${getTokenSymbol(collateralToken)})`}
          content={collateral}
        />
        <Definition term="Leverage" content={formatRate(leverage)} />
        <Definition
          term="Liquidation Price"
          content={formatCurrency_USD(liquidationPrice)}
        />
      </dl>
      <Button type="submit" variant="accent">
        {newTriggerPrice > 0 ? "Set take profit" : "Enter amount"}
      </Button>
    </form>
  );
};

export { TakeProfitForm, useTakeProfitForm };
