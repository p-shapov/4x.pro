"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Wallet } from "@4x.pro/components/wallet";
import { useLiquidationPriceStats } from "@4x.pro/services/perpetuals/hooks/use-liquidation-price-stats";
import { usePool } from "@4x.pro/services/perpetuals/hooks/use-pool";
import { useUpdateOrder } from "@4x.pro/services/perpetuals/hooks/use-update-order";
import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-connection";
import {
  formatCurrency,
  formatCurrency_USD,
  formatRate,
} from "@4x.pro/shared/utils/number";
import { Button } from "@4x.pro/ui-kit/button";
import { Comparison } from "@4x.pro/ui-kit/comparison";
import { Definition } from "@4x.pro/ui-kit/definition";
import { messageToast } from "@4x.pro/ui-kit/message-toast";
import { NumberField } from "@4x.pro/ui-kit/number-field";

import type { SubmitData } from "./schema";
import { mkTakeProfitFormStyles } from "./styles";

type Props = {
  position: PositionAccount;
  form: UseFormReturn<SubmitData>;
};

const useTakeProfitForm = (triggerPrice: number = 0) => {
  return useForm<SubmitData>({
    defaultValues: {
      triggerPrice,
    },
  });
};

const TakeProfitForm: FC<Props> = ({ position, form }) => {
  const collateral = position.collateralAmount.toNumber() / LAMPORTS_PER_SOL;
  const collateralToken = position.token;
  const leverage = position.getLeverage();
  const triggerPrice = position.getTakeProfit() || 0;
  const takeProfitFormStyles = mkTakeProfitFormStyles();
  const newTriggerPrice = useWatch({
    control: form.control,
    name: "triggerPrice",
  });
  const { price: marketPrice } =
    useWatchPythPriceFeed(collateralToken).priceData || {};
  const walletContextState = useWallet();
  const size = collateral * leverage;
  const liquidationPrice = useLiquidationPriceStats({
    position: position,
  });
  const { data: pool } = usePool({ address: position.pool });
  const mkHandleChange =
    (onChange: (value: number) => void) => (value: number | "") => {
      onChange(value || 0);
    };
  const updateOrder = useUpdateOrder();
  const errors = form.formState.errors;
  const handleSubmit = form.handleSubmit(async (data) => {
    if (!pool) {
      return messageToast("No pool found", "error");
    } else {
      await updateOrder.mutateAsync({
        type: "take-profit",
        position,
        pool,
        triggerPrice: data.triggerPrice,
      });
    }
  });
  return (
    <form
      className={takeProfitFormStyles.root}
      noValidate
      onSubmit={handleSubmit}
    >
      <Controller<SubmitData, "triggerPrice">
        name="triggerPrice"
        control={form.control}
        render={({ field: { value, onChange } }) => (
          <NumberField
            label={`Take Profit Price: ${formatCurrency_USD(newTriggerPrice)}`}
            unit="$"
            placeholder="0.00"
            value={value}
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
        {/* <Definition
          term="Estimated PnL"
          content={formatCurrency_USD(pnl.data)}
        /> */}
        <Definition
          term="Trigger Price"
          content={
            <Comparison
              initial={triggerPrice}
              final={newTriggerPrice}
              formatValue={formatCurrency_USD}
            />
          }
        />
        <Definition
          term="Size"
          content={formatCurrency(collateralToken)(size)}
        />
        <Definition
          term="Collateral"
          content={formatCurrency(collateralToken)(collateral)}
        />
        <Definition term="Leverage" content={formatRate(leverage)} />
        <Definition
          term="Liq. Price"
          content={formatCurrency_USD(liquidationPrice.data)}
        />
      </dl>
      {!walletContextState.connected ? (
        <Wallet.Connect variant="accent" size="lg" />
      ) : (
        <Button
          type="submit"
          variant="accent"
          size="lg"
          loading={updateOrder.isPending}
        >
          {newTriggerPrice > 0 ? "Set take profit" : "Enter amount"}
        </Button>
      )}
    </form>
  );
};

export { TakeProfitForm, useTakeProfitForm };
