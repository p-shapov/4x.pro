"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import { Wallet } from "@4x.pro/components/wallet";
import { useLiquidationPriceStats } from "@4x.pro/services/perpetuals/hooks/use-liquidation-price-stats";
import { usePools } from "@4x.pro/services/perpetuals/hooks/use-pools";
import { useUpdateOrder } from "@4x.pro/services/perpetuals/hooks/use-update-order";
import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import type { OrderTxType } from "@4x.pro/services/perpetuals/lib/types";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-connection";
import {
  formatCurrency,
  formatCurrency_USD,
  formatRate,
} from "@4x.pro/shared/utils/number";
import { Button } from "@4x.pro/ui-kit/button";
import { Comparison } from "@4x.pro/ui-kit/comparison";
import { Definition } from "@4x.pro/ui-kit/definition";

import { mkCancelOrderFormStyles } from "./styles";

type Props = {
  type: OrderTxType;
  position: PositionAccount;
  form: UseFormReturn;
};

const useCancelOrderForm = () => {
  return useForm();
};

const CancelOrderForm: FC<Props> = ({ type, position, form }) => {
  const collateral = position.collateralAmount.toNumber() / LAMPORTS_PER_SOL;
  const collateralToken = position.token;
  const leverage = position.getLeverage();
  const triggerPrice = position.getStopLoss() || 0;
  const updateOrder = useUpdateOrder();
  const cancelOrderFormStyles = mkCancelOrderFormStyles();
  const { data: poolsData } = usePools();
  const pool = Object.values(poolsData || {})[0];
  const walletContextState = useWallet();
  const { price: marketPrice } =
    useWatchPythPriceFeed(collateralToken).priceData || {};
  const size = collateral * leverage;
  const liquidationPrice = useLiquidationPriceStats({
    position,
  });
  const handleSubmit = form.handleSubmit(async () => {
    await updateOrder.mutateAsync({
      type,
      position,
      pool,
      triggerPrice: null,
    });
  });
  return (
    <form
      className={cancelOrderFormStyles.root}
      noValidate
      onSubmit={handleSubmit}
    >
      <dl className={cancelOrderFormStyles.statsList}>
        <Definition
          term="Mark price"
          content={formatCurrency_USD(marketPrice)}
        />
        {/* <Definition
          term="Estimated PnL"
          content={formatCurrency_USD(estimatedPnL)}
        /> */}
        <Definition
          term="Trigger Price"
          content={
            <Comparison
              initial={triggerPrice}
              final={undefined}
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
          Cancel Order
        </Button>
      )}
    </form>
  );
};

export { CancelOrderForm, useCancelOrderForm };
