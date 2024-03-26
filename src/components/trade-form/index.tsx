"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";

import { Button } from "@4x.pro/ui-kit/button";

import { ClosingOptions } from "./closing-options";
import { Leverage } from "./leverage";
import { Position } from "./position";
import { TradeFormProvider } from "./provider";
import type { SubmitData } from "./schema";
import { submitDataSchema } from "./schema";
import { Slippage } from "./slippage";
import { mkTradeFormStyles } from "./styles";

type Props = {
  form: UseFormReturn<SubmitData>;
  type: "buy" | "sell";
};

const useTradeForm = () => {
  const form = useForm<SubmitData>({
    defaultValues: {
      leverage: 1.1,
      slippage: 0.5,
      position: {
        base: {
          token: "USDC",
          size: 0,
        },
        quote: {
          token: "SOL",
          size: 0,
        },
      },
    },
    resolver: yupResolver(submitDataSchema),
  });
  return form;
};

const TradeForm: FC<Props> = ({ type, form }) => {
  const tradeFormStyles = mkTradeFormStyles();
  const handleSubmit = form.handleSubmit((data) => {
    alert(JSON.stringify(data));
  });
  const getTitle = () => {
    switch (type) {
      case "buy":
        return "Long / Buy";
      case "sell":
        return "Short / Sell";
    }
  };
  const getButtonVariant = () => {
    switch (type) {
      case "buy":
        return "primary";
      case "sell":
        return "red";
    }
  };
  return (
    <form className={tradeFormStyles.root} onSubmit={handleSubmit}>
      <Position form={form} />
      <Leverage form={form} />
      <Slippage form={form} />
      <ClosingOptions form={form} />
      <Button type="submit" variant={getButtonVariant()}>
        {getTitle()}
      </Button>
    </form>
  );
};

export { TradeForm, useTradeForm, TradeFormProvider };
