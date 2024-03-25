"use client";
import { useDeferredValue, useEffect } from "react";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";

import { tokenList } from "@4x.pro/configs/dex-platform";
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
};

const Position: FC<Props> = ({ form }) => {
  const { lastTouchedPosition, setLastTouchedPosition } =
    useLastTouchedPosition();
  const positionStyles = mkPositionStyles();
  const base = useDeferredValue(
    useWatch({ control: form.control, name: "position.base" }),
  );
  const quote = useDeferredValue(
    useWatch({ control: form.control, name: "position.quote" }),
  );
  const leverage =
    useDeferredValue(useWatch({ control: form.control, name: "leverage" })) ||
    1;
  const { priceData: baseTokenPriceData } =
    useWatchPythPriceFeed(base?.token) || {};
  const { priceData: quoteTokenPriceData } =
    useWatchPythPriceFeed(quote?.token) || {};
  const rate =
    baseTokenPriceData?.price && quoteTokenPriceData?.price
      ? quoteTokenPriceData.price / baseTokenPriceData.price
      : undefined;
  useEffect(() => {
    if (!rate) return;
    switch (lastTouchedPosition) {
      case "base":
        form.setValue("position.quote", {
          size: roundToFirstNonZeroDecimal((base.size / rate) * leverage),
          token: quote.token,
        });
        break;
      case "quote":
        form.setValue("position.base", {
          size: roundToFirstNonZeroDecimal((quote.size * rate) / leverage),
          token: base.token,
        });
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base.token, leverage, quote.token]);
  const mkHandleChangeBase =
    (onChange: (data: { size: number; token: Token }) => void) =>
    (data: { amount: number; token: Token }) => {
      if (!rate) return;
      if (base.size !== data.amount) {
        setLastTouchedPosition("base");
        form.setValue("position.quote", {
          size: roundToFirstNonZeroDecimal((data.amount / rate) * leverage),
          token: quote.token,
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
      if (quote.size !== data.amount) {
        setLastTouchedPosition("quote");
        form.setValue("position.base", {
          size: roundToFirstNonZeroDecimal((data.amount * rate) / leverage),
          token: base.token,
        });
      }
      console.log(data);
      onChange({
        size: data.amount,
        token: data.token,
      });
    };
  return (
    <fieldset className={positionStyles.root}>
      <div className={positionStyles.stats}>
        <span className={positionStyles.statsItem}>
          Market:{" "}
          <span className={positionStyles.statsValue}>
            <TokenPrice token={quote.token} fractionalDigits={2} />
          </span>
        </span>
        <span className={positionStyles.statsDelimiter} />
        <span className={positionStyles.statsItem}>
          Limit:{" "}
          <span className={positionStyles.statsValue}>
            <TokenPrice token={quote.token} fractionalDigits={2} />
          </span>
        </span>
      </div>
      <Controller<SubmitData, "position.base">
        name="position.base"
        control={form.control}
        render={({ field: { onChange, value: data } }) => (
          <TokenField
            placeholder="0.00"
            tokenList={tokenList}
            value={{
              amount: data.size || "",
              token: data.token,
            }}
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
            tokenList={[quote.token]}
            value={{
              amount: data.size || "",
              token: data.token,
            }}
            onChange={mkHandleChangeQuote(onChange)}
          />
        )}
      />
    </fieldset>
  );
};

export { Position };
