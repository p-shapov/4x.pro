"use client";
import { useCallback, useDeferredValue, useEffect } from "react";
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
  const baseToken = useDeferredValue(
    useWatch({ control: form.control, name: "position.base.token" }),
  );
  const baseSize = useDeferredValue(
    useWatch({ control: form.control, name: "position.base.size" }),
  );
  const quoteToken = useDeferredValue(
    useWatch({ control: form.control, name: "position.quote.token" }),
  );
  const quoteSize = useDeferredValue(
    useWatch({ control: form.control, name: "position.quote.size" }),
  );
  const leverage =
    useDeferredValue(useWatch({ control: form.control, name: "leverage" })) ||
    1;
  const { priceData: baseTokenPriceData } =
    useWatchPythPriceFeed(baseToken) || {};
  const { priceData: quoteTokenPriceData } =
    useWatchPythPriceFeed(quoteToken) || {};
  const rate =
    baseTokenPriceData?.price && quoteTokenPriceData?.price
      ? quoteTokenPriceData.price / baseTokenPriceData.price
      : undefined;
  useEffect(() => {
    if (!rate) return;
    switch (lastTouchedPosition) {
      case "base":
        form.setValue("position.quote", {
          size: roundToFirstNonZeroDecimal((baseSize / rate) * leverage),
          token: quoteToken,
        });
        break;
      case "quote":
        form.setValue("position.base", {
          size: roundToFirstNonZeroDecimal((quoteSize * rate) / leverage),
          token: baseToken,
        });
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteToken, baseToken, leverage]);
  const mkHandleChangeBase = useCallback(
    (onChange: (data: { size: number; token: Token }) => void) =>
      (data: { amount: number; token: Token }) => {
        if (!rate) return;
        if (baseSize !== data.amount) {
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
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseSize, form, leverage, quoteToken, setLastTouchedPosition],
  );
  const mkHandleChangeQuote = useCallback(
    (onChange: (data: { size: number; token: Token }) => void) =>
      (data: { amount: number; token: Token }) => {
        if (!rate) return;
        if (quoteSize !== data.amount) {
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
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseToken, form, leverage, quoteSize, setLastTouchedPosition],
  );
  return (
    <fieldset className={positionStyles.root}>
      <div className={positionStyles.stats}>
        <span className={positionStyles.statsItem}>
          Market:{" "}
          <span className={positionStyles.statsValue}>
            <TokenPrice token={quoteToken} fractionalDigits={2} />
          </span>
        </span>
        <span className={positionStyles.statsDelimiter} />
        <span className={positionStyles.statsItem}>
          Limit:{" "}
          <span className={positionStyles.statsValue}>
            <TokenPrice token={quoteToken} fractionalDigits={2} />
          </span>
        </span>
      </div>
      <Controller<SubmitData, "position.base">
        name="position.base"
        control={form.control}
        render={useCallback(
          ({ field: { onChange, value: data } }) => (
            <TokenField
              placeholder="0.00"
              tokenList={tokenList}
              value={data.size || ""}
              token={data.token}
              showBalance
              onChange={mkHandleChangeBase(onChange)}
            />
          ),
          [mkHandleChangeBase],
        )}
      />
      <Controller<SubmitData, "position.quote">
        name="position.quote"
        control={form.control}
        render={useCallback(
          ({ field: { onChange, value: data } }) => (
            <TokenField
              placeholder="0.00"
              tokenList={[data.token]}
              value={data.size || ""}
              token={data.token}
              onChange={mkHandleChangeQuote(onChange)}
            />
          ),
          [mkHandleChangeQuote],
        )}
      />
    </fieldset>
  );
};

export { Position };
