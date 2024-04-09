"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWallet } from "@solana/wallet-adapter-react";
import dayjs from "dayjs";
import { useDeferredValue } from "react";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";

import type { Token } from "@4x.pro/app-config";
import { Wallet } from "@4x.pro/components/wallet";
import { useChangeCollateral } from "@4x.pro/services/perpetuals/hooks/use-change-collateral";
import { useCustodies } from "@4x.pro/services/perpetuals/hooks/use-custodies";
import { useLiquidationPriceStats } from "@4x.pro/services/perpetuals/hooks/use-liquidation-price-stats";
import { usePools } from "@4x.pro/services/perpetuals/hooks/use-pools";
import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { Side, Tab } from "@4x.pro/services/perpetuals/lib/types";
import { useUpdateTradingHistory } from "@4x.pro/services/trading-history/hooks/use-update-trading-history";
import {
  formatCurrency,
  formatCurrency_USD,
  formatPercentage,
  formatRate,
} from "@4x.pro/shared/utils/number";
import { Button } from "@4x.pro/ui-kit/button";
import { Comparison } from "@4x.pro/ui-kit/comparison";
import { Definition } from "@4x.pro/ui-kit/definition";
import { messageToast } from "@4x.pro/ui-kit/message-toast";
import { RangeSlider } from "@4x.pro/ui-kit/range-slider";
// import { Select } from "@4x.pro/ui-kit/select";
import { TokenField } from "@4x.pro/ui-kit/token-field";
// import { TokenPrice } from "@4x.pro/ui-kit/token-price";

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

// const receiveTokens: readonly Token[] = ["SOL", "USDC", "BTC", "ETH"];

const RemoveCollateralForm: FC<Props> = ({ position, form }) => {
  const walletContextState = useWallet();
  const { data: custodies } = useCustodies();
  const custody = custodies?.[position.custody.toBase58()];
  const collateral =
    custody && position.collateralAmount.toNumber() / 10 ** custody.decimals;
  const entryPrice = position.getPrice();
  const collateralToken = position.token;
  const leverage = position.getLeverage();
  const side = position.side === Side.Long ? "long" : "short";
  const errors = form.formState.errors;
  const removeCollateralFormStyles = mkRemoveCollateralFormStyles();
  const tradingHistory = useUpdateTradingHistory();
  const withdrawalAmount = useWatch({
    control: form.control,
    name: "withdrawalAmount",
  });
  const size = collateral && collateral * leverage;
  const collateralAfterWithdraw = collateral && collateral - withdrawalAmount;
  const leverageAfterWithdraw =
    size && collateralAfterWithdraw && size / collateralAfterWithdraw;
  const { data: liqPrice } = useLiquidationPriceStats({
    position,
  });
  const { data: liqPriceAfterWithdraw } = useLiquidationPriceStats({
    position,
    withdrawalAmount: useDeferredValue(withdrawalAmount),
  });
  const { data: poolsData } = usePools();
  const pool = Object.values(poolsData || {})[0];
  const changeCollateral = useChangeCollateral();
  const handleSubmit = form.handleSubmit(async (data) => {
    if (leverageAfterWithdraw && leverageAfterWithdraw < 1) {
      messageToast("Position leverage cannot be less than 1", "error");
    } else if (!pool) {
      messageToast("No pool found", "error");
    } else {
      try {
        messageToast("Transaction submitted", "success");
        const txid = await changeCollateral.mutateAsync({
          collatNum: data.withdrawalAmount * entryPrice,
          tab: Tab.Remove,
          position,
          pool,
        });
        await tradingHistory.mutateAsync({
          token: collateralToken,
          type: "remove-collateral",
          time: dayjs().utc(false).unix(),
          txid,
          txData: {
            side,
            price: entryPrice,
            size,
            collateral: collateralAfterWithdraw,
            leverage: leverageAfterWithdraw,
          },
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
      if (!collateral) return;
      onChange((collateral / 100) * percentage);
    };
  // const mkHandleSelectChange =
  //   (onChange: (receiveToken: Token) => void) => (token: string) => {
  //     onChange(token as Token);
  //   };
  const isInsufficientBalance = collateral && withdrawalAmount > collateral;
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
              value={value}
              token={collateralToken}
              max={collateral}
              placeholder="0.00"
              labelVariant="max"
              onChange={mkHandleFieldChange(onChange)}
              error={!!errors.withdrawalAmount}
              presets={[20, 40, 60, 80]}
              mapPreset={(value) => (collateral || 0) * (value / 100)}
              formatPresets={(value) => formatPercentage(value, 0)}
              showSymbol
            />
          )}
        />
        <Controller<SubmitData, "withdrawalAmount">
          name="withdrawalAmount"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <RangeSlider
              value={collateral ? (value / collateral) * 100 : 0}
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
        {/* <Definition
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
        /> */}
        <Definition
          term="Size"
          content={formatCurrency(collateralToken)(size)}
        />
        <Definition
          term="Collateral"
          content={
            <Comparison
              initial={collateral}
              final={collateralAfterWithdraw}
              formatValue={formatCurrency(collateralToken)}
            />
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
              initial={liqPrice}
              final={liqPriceAfterWithdraw}
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
          disabled={!!isInsufficientBalance}
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
