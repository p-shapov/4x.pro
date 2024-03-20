"use client";
import { useState } from "react";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";

import { tokenList } from "@4x.pro/configs/token-config";
import type { Token } from "@4x.pro/configs/token-config";
import { useTokenInfo } from "@4x.pro/shared/hooks/use-token-info";
import { formatCurrency_USD } from "@4x.pro/shared/utils/number";
import { TokenField } from "@4x.pro/ui-kit/token-field";

import type { SubmitData } from "./schema";
import { mkPositionStyles } from "./styles";

type Props = {
  quoteToken: Token;
  form: UseFormReturn<SubmitData>;
};

const Position: FC<Props> = ({ form, quoteToken }) => {
  const [changingField, setChangingField] = useState<"base" | "quote">("base");
  const positionStyles = mkPositionStyles();
  // TODO :: replace by real rate
  const rate = 129.45;
  const base = useWatch({ control: form.control, name: "position.base" });
  const leverage = useWatch({ control: form.control, name: "leverage" }) || 1;
  const quoteTokenInfo = useTokenInfo(quoteToken);
  const mkHandleChangeBase =
    (onChange: (data: { amount: number; token: Token }) => void) =>
    (data: { amount: number; token: Token }) => {
      setChangingField("base");
      onChange(data);
      form.setValue("position.quote", {
        token: quoteToken,
        amount: data.amount / rate,
      });
    };
  const mkHandleChangeQuote =
    (onChange: (data: { amount: number; token: Token }) => void) =>
    (data: { amount: number; token: Token }) => {
      setChangingField("quote");
      onChange(data);
      form.setValue("position.base", {
        token: base.token,
        amount: data.amount * rate,
      });
    };
  return (
    <fieldset className={positionStyles.root}>
      <div className={positionStyles.stats}>
        <span className={positionStyles.statsItem}>
          Market:{" "}
          <span className={positionStyles.statsValue}>
            {formatCurrency_USD(quoteTokenInfo.priceData?.price, 2)}
          </span>
        </span>
        <span className={positionStyles.statsDelimiter} />
        <span className={positionStyles.statsItem}>
          Limit:{" "}
          <span className={positionStyles.statsValue}>
            {formatCurrency_USD(quoteTokenInfo.priceData?.price, 2)}
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
              amount:
                (data.amount &&
                  data.amount / (changingField === "quote" ? leverage : 1)) ||
                "",
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
              amount:
                (data.amount &&
                  data.amount * (changingField === "base" ? leverage : 1)) ||
                "",
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
