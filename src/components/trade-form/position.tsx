"use client";
import { useEffect } from "react";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";

import {
  depositTokens,
  useDexPlatformConfig,
} from "@4x.pro/configs/dex-platform";
import type { Token } from "@4x.pro/configs/dex-platform";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-price-feed";
import { roundToFirstNonZeroDecimal } from "@4x.pro/shared/utils/number";
import { TokenField } from "@4x.pro/ui-kit/token-field";
import { TokenPrice } from "@4x.pro/ui-kit/token-price";

import { useLastTouchedPosition } from "./provider";
import type { SubmitData } from "./schema";
import { mkPositionStyles } from "./styles";

type Props = {
  form: UseFormReturn<SubmitData>;
  collateralTokens: readonly Token[];
};

const Position: FC<Props> = ({ form, collateralTokens }) => {
  const { lastTouchedPosition, setLastTouchedPosition } =
    useLastTouchedPosition();
  const positionStyles = mkPositionStyles();
  const baseToken = useWatch({
    control: form.control,
    name: "position.base.token",
  });
  const quoteToken = useWatch({
    control: form.control,
    name: "position.quote.token",
  });
  const leverage = useWatch({ control: form.control, name: "leverage" });
  const pythConnection = useDexPlatformConfig((state) => state.pythConnection);
  const { priceData: baseTokenPriceData } =
    useWatchPythPriceFeed(pythConnection)(baseToken) || {};
  const { priceData: quoteTokenPriceData } =
    useWatchPythPriceFeed(pythConnection)(quoteToken) || {};
  const rate =
    baseTokenPriceData?.price && quoteTokenPriceData?.price
      ? quoteTokenPriceData.price / baseTokenPriceData.price
      : undefined;
  useEffect(() => {
    if (!rate) return;
    switch (lastTouchedPosition) {
      case "base":
        const baseSize = form.getValues("position.base.size");
        form.setValue("position.quote", {
          size: roundToFirstNonZeroDecimal((baseSize / rate) * leverage),
          token: quoteToken,
        });
        break;
      case "quote":
        const quoteSize = form.getValues("position.quote.size");
        form.setValue("position.base", {
          size: roundToFirstNonZeroDecimal((quoteSize * rate) / leverage),
          token: baseToken,
        });
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteToken, baseToken, leverage]);
  const mkHandleChangeBase =
    (onChange: (data: { size: number; token: Token }) => void) =>
    (data: { amount: number; token: Token }) => {
      if (!rate) return;
      const baseSize = form.getValues("position.base.size");
      if (baseSize !== data.amount) {
        const quoteToken = form.getValues("position.quote.token");
        setLastTouchedPosition("base");
        form.setValue("position.quote", {
          size: roundToFirstNonZeroDecimal((data.amount / rate) * leverage),
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
      if (!rate) return;
      const quoteSize = form.getValues("position.quote.size");
      if (quoteSize !== data.amount) {
        const baseToken = form.getValues("position.base.token");
        setLastTouchedPosition("quote");
        form.setValue("position.base", {
          size: roundToFirstNonZeroDecimal((data.amount * rate) / leverage),
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
            tokenList={depositTokens}
            value={data.size || ""}
            token={data.token}
            showBalance
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
            value={data.size || ""}
            token={data.token}
            onChange={mkHandleChangeQuote(onChange)}
          />
        )}
      />
    </fieldset>
  );
};

export { Position };
