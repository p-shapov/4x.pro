"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";

import { getTokenSymbol } from "@4x.pro/app-config";
import { Wallet } from "@4x.pro/components/wallet";
import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { Side } from "@4x.pro/services/perpetuals/lib/types";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-connection";
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
import { mkStopLossFormStyles } from "./styles";

type Props = {
  position: PositionAccount;
  form: UseFormReturn<SubmitData>;
};

const useStopLossForm = (triggerPrice: number = 0) => {
  return useForm<SubmitData>({
    defaultValues: {
      triggerPrice,
    },
  });
};

const StopLossForm: FC<Props> = ({ position, form }) => {
  const collateral = position.collateralAmount.toNumber() / LAMPORTS_PER_SOL;
  const entryPrice = position.getPrice();
  const collateralToken = position.token;
  const leverage = position.getLeverage();
  const side = position.side === Side.Long ? "long" : "short";
  // TODO - get trigger price from position
  const triggerPrice = undefined;
  const stopLossFormStyles = mkStopLossFormStyles();
  const newTriggerPrice = useWatch({
    control: form.control,
    name: "triggerPrice",
  });
  const walletContextState = useWallet();
  const { price: marketPrice } =
    useWatchPythPriceFeed(collateralToken).priceData || {};
  const size = collateral * leverage;
  const liquidationPrice = calculateLiquidationPrice(
    entryPrice,
    leverage,
    0.1,
    side === "long",
  );
  const estimatedPnL = newTriggerPrice
    ? calculatePnL(
        entryPrice,
        newTriggerPrice,
        size * entryPrice,
        side === "long",
      )
    : undefined;
  const mkHandleChange =
    (onChange: (value: number) => void) => (value: number | "") => {
      onChange(Number(value));
    };
  const errors = form.formState.errors;
  return (
    <form className={stopLossFormStyles.root} noValidate>
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
      <dl className={stopLossFormStyles.statsList}>
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
      {!walletContextState.connected ? (
        <Wallet.Connect variant="accent" size="lg" />
      ) : (
        <Button type="submit" variant="accent" size="lg">
          {newTriggerPrice > 0 ? "Set stop loss" : "Enter amount"}
        </Button>
      )}
    </form>
  );
};

export { StopLossForm, useStopLossForm };
