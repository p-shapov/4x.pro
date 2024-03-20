"use client";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";

import { tokenList } from "@4x.pro/configs/token-config";
import type { Token } from "@4x.pro/configs/token-config";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-price-feed";
import { TokenField } from "@4x.pro/ui-kit/token-field";
import { TokenPrice } from "@4x.pro/ui-kit/token-price";

import { useLastTouchedPosition } from "./provider";
import type { SubmitData } from "./schema";
import { mkPositionStyles } from "./styles";

type Props = {
  quoteToken: Token;
  form: UseFormReturn<SubmitData>;
};

const Position: FC<Props> = ({ form, quoteToken }) => {
  const { lastTouchedPosition, setLastTouchedPosition } =
    useLastTouchedPosition();
  const positionStyles = mkPositionStyles();
  const base = useWatch({ control: form.control, name: "position.base" });
  const leverage = useWatch({ control: form.control, name: "leverage" }) || 1;
  const { priceData: baseTokenPriceData } = useWatchPythPriceFeed(base.token);
  const { priceData: quoteTokenPriceData } = useWatchPythPriceFeed(quoteToken);
  const rate =
    baseTokenPriceData?.price && quoteTokenPriceData?.price
      ? quoteTokenPriceData.price / baseTokenPriceData.price
      : undefined;
  const mkHandleChangeBase =
    (onChange: (data: { size: number; token: Token }) => void) =>
    (data: { amount: number; token: Token }) => {
      if (!rate) return;
      setLastTouchedPosition("base");
      onChange({ size: data.amount, token: data.token });
      form.setValue("position.quote", {
        token: quoteToken,
        size: Number((data.amount / rate).toFixed(4)),
      });
    };
  const mkHandleChangeQuote =
    (onChange: (data: { size: number; token: Token }) => void) =>
    (data: { amount: number; token: Token }) => {
      if (!rate) return;
      setLastTouchedPosition("quote");
      onChange({ size: data.amount, token: data.token });
      form.setValue("position.base", {
        token: base.token,
        size: Number((data.amount * rate).toFixed(4)),
      });
    };
  const getBaseSize = (size?: number) => {
    if (!rate || !size) return "" as const;
    if (lastTouchedPosition === "quote")
      return (size / leverage).toFixed(4) as "";
    return size;
  };
  const getQuoteSize = (size?: number) => {
    if (!rate || !size) return "" as const;
    if (lastTouchedPosition === "base")
      return (size * leverage).toFixed(4) as "";
    return size;
  };
  return (
    <fieldset className={positionStyles.root}>
      <div className={positionStyles.stats}>
        <span className={positionStyles.statsItem}>
          Market:{" "}
          <span className={positionStyles.statsValue}>
            <TokenPrice token={quoteToken} />
          </span>
        </span>
        <span className={positionStyles.statsDelimiter} />
        <span className={positionStyles.statsItem}>
          Limit:{" "}
          <span className={positionStyles.statsValue}>
            <TokenPrice token={quoteToken} />
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
              amount: getBaseSize(data.size),
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
            tokenList={[quoteToken]}
            value={{
              amount: getQuoteSize(data.size),
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
