"use client";
import { useDeferredValue, useEffect } from "react";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";

import { collateralTokens, payTokens } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";
import { useEntryPriceStats } from "@4x.pro/services/perpetuals/hooks/use-entry-price-stats";
import type { PoolAccount } from "@4x.pro/services/perpetuals/lib/pool-account";
import type { PositionSide } from "@4x.pro/services/perpetuals/lib/types";
import { roundToFirstNonZeroDecimal } from "@4x.pro/shared/utils/number";
import { TokenField } from "@4x.pro/ui-kit/token-field";
import { TokenPrice } from "@4x.pro/ui-kit/token-price";

import { useLastTouchedPosition } from "./provider";
import type { SubmitData } from "./schema";
import { mkPositionStyles } from "./styles";

type Props = {
  pool: PoolAccount;
  form: UseFormReturn<SubmitData>;
  side: PositionSide;
};

const Position: FC<Props> = ({ pool, form, side }) => {
  const errors = form.formState.errors;
  const { lastTouchedPosition, setLastTouchedPosition } =
    useLastTouchedPosition();
  const positionStyles = mkPositionStyles();
  const baseSize = useWatch({
    control: form.control,
    name: "position.base.size",
  });
  const baseToken = useWatch({
    control: form.control,
    name: "position.base.token",
  });
  const quoteSize = useWatch({
    control: form.control,
    name: "position.quote.size",
  });
  const quoteToken = useWatch({
    control: form.control,
    name: "position.quote.token",
  });
  const leverage = useWatch({ control: form.control, name: "leverage" });
  const { data: basePriceStats } = useEntryPriceStats({
    pool,
    side,
    collateral: useDeferredValue(baseSize) || 0,
    collateralToken: baseToken,
    size: useDeferredValue(baseSize * leverage) || 0,
  });
  const { data: quotePriceStats } = useEntryPriceStats({
    pool,
    side,
    collateral: useDeferredValue(quoteSize) || 0,
    collateralToken: quoteToken,
    size: useDeferredValue(quoteSize * leverage) || 0,
  });
  const rate =
    baseToken === quoteToken
      ? 1
      : basePriceStats?.entryPrice && quotePriceStats?.entryPrice
      ? quotePriceStats.entryPrice / basePriceStats.entryPrice
      : 1;
  const roundSize = (size: number) => {
    return baseToken === quoteToken ? size : roundToFirstNonZeroDecimal(size);
  };
  useEffect(() => {
    switch (lastTouchedPosition) {
      case "base":
        const baseSize = form.getValues("position.base.size");
        form.setValue("position.quote", {
          size: roundSize((baseSize / rate) * leverage),
          token: quoteToken,
        });
        break;
      case "quote":
        const quoteSize = form.getValues("position.quote.size");
        form.setValue("position.base", {
          size: roundSize((quoteSize * rate) / leverage),
          token: baseToken,
        });
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteToken, baseToken, leverage, rate]);
  const mkHandleChangeBase =
    (onChange: (data: { size: number; token: Token }) => void) =>
    (data: { amount: number; token: Token }) => {
      const baseSize = form.getValues("position.base.size");
      if (baseSize !== data.amount) {
        const quoteToken = form.getValues("position.quote.token");
        setLastTouchedPosition("base");
        form.setValue("position.quote", {
          size: roundSize((data.amount / rate) * leverage),
          token: quoteToken,
        });
      }
      onChange({
        size: data.amount,
        token: data.token,
      });
    };
  const mkHandleChangeQuote =
    (onChange: (data: { size: number; token: Token }) => void) =>
    (data: { amount: number; token: Token }) => {
      const quoteSize = form.getValues("position.quote.size");
      if (quoteSize !== data.amount) {
        const baseToken = form.getValues("position.base.token");
        setLastTouchedPosition("quote");
        form.setValue("position.base", {
          size: roundSize((data.amount * rate) / leverage),
          token: baseToken,
        });
      }
      onChange({
        size: data.amount,
        token: data.token,
      });
    };
  return (
    <fieldset className={positionStyles.root}>
      <div className={positionStyles.stats}>
        <span className={positionStyles.statsTitle}>Market:</span>
        <span className={positionStyles.statsValue}>
          <TokenPrice token={quoteToken} fractionalDigits={2} watch />
        </span>
      </div>
      <Controller<SubmitData, "position.base">
        name="position.base"
        control={form.control}
        render={({ field: { onChange, value: data } }) => (
          <TokenField
            placeholder="0.00"
            tokenList={payTokens}
            value={
              quoteToken !== baseToken &&
              rate === 1 &&
              lastTouchedPosition === "quote"
                ? 0
                : data.size || 0
            }
            token={data.token}
            error={
              !!(errors.position?.quote?.size && errors.position?.base?.size)
            }
            onChange={mkHandleChangeBase(onChange)}
          />
        )}
      />
      <Controller<SubmitData, "position.quote">
        name="position.quote"
        control={form.control}
        render={({ field: { onChange, value: data } }) => (
          <TokenField
            placeholder="0.00"
            tokenList={collateralTokens}
            value={
              quoteToken !== baseToken &&
              rate === 1 &&
              lastTouchedPosition === "base"
                ? 0
                : data.size || 0
            }
            error={
              !!(errors.position?.quote?.size && errors.position?.base?.size)
            }
            token={data.token}
            onChange={mkHandleChangeQuote(onChange)}
          />
        )}
      />
    </fieldset>
  );
};

export { Position };
