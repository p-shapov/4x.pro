"use client";
import { useState } from "react";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";

import { TokenField } from "@promo-shock/ui-kit/token-field";

import type { SubmitData } from "./schema";
import { mkPositionStyles } from "./styles";

type Token = {
  account: string;
  symbol: string;
  uri: string;
};

type Props = {
  baseTokenList: Token[];
  quoteToken: Token;
  form: UseFormReturn<SubmitData>;
};

const Position: FC<Props> = ({ form, baseTokenList, quoteToken }) => {
  const [changingField, setChangingField] = useState<"base" | "quote">("base");
  const positionStyles = mkPositionStyles();
  // TODO :: replace by real rate
  const rate = 129.45;
  const baseToken = useWatch({ control: form.control, name: "position.base" });
  const leverage = useWatch({ control: form.control, name: "leverage" }) || 1;
  const mkHandleChangeBase =
    (onChange: (data: { value: number; tokenAccount: string }) => void) =>
    (data: { value: number; tokenAccount: string }) => {
      setChangingField("base");
      onChange(data);
      form.setValue("position.quote", {
        ...quoteToken,
        value: data.value / rate,
      });
    };
  const mkHandleChangeQuote =
    (onChange: (data: { value: number; tokenAccount: string }) => void) =>
    (data: { value: number; tokenAccount: string }) => {
      setChangingField("quote");
      onChange(data);
      form.setValue("position.base", {
        ...baseToken,
        value: data.value * rate,
      });
    };
  return (
    <fieldset className={positionStyles.root}>
      <div className={positionStyles.stats}>
        <span className={positionStyles.statsItem}>
          Market: <span className={positionStyles.statsValue}>129.45 $</span>
        </span>
        <span className={positionStyles.statsDelimiter} />
        <span className={positionStyles.statsItem}>
          Limit: <span className={positionStyles.statsValue}>129.45 $</span>
        </span>
      </div>
      <Controller<SubmitData, "position.base">
        name="position.base"
        control={form.control}
        render={({ field: { onChange, value: data } }) => (
          <TokenField
            placeholder="0.00"
            tokenList={baseTokenList}
            value={
              (data &&
                data.value / (changingField === "quote" ? leverage : 1)) ||
              ""
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
            tokenList={[quoteToken]}
            value={
              (data &&
                data.value * (changingField === "base" ? leverage : 1)) ||
              ""
            }
            onChange={mkHandleChangeQuote(onChange)}
          />
        )}
      />
    </fieldset>
  );
};

export { Position };
