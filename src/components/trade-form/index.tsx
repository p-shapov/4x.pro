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
  side: "short" | "long";
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

const TradeForm: FC<Props> = ({ side, form }) => {
  const tradeFormStyles = mkTradeFormStyles();
  const handleSubmit = form.handleSubmit((data) => {
    alert(JSON.stringify(data));
  });
  const getTitle = () => {
    switch (side) {
      case "long":
        return "Long / Buy";
      case "short":
        return "Short / Sell";
    }
  };
  const getButtonVariant = () => {
    switch (side) {
      case "long":
        return "primary";
      case "short":
        return "red";
    }
  };
  return (
    <form className={tradeFormStyles.root} onSubmit={handleSubmit}>
      <Position form={form} />
      <Leverage form={form} />
      <Slippage form={form} />
      <ClosingOptions form={form} />
      <Button
        type="submit"
        variant={getButtonVariant()}
        disabled={!form.formState.isValid}
      >
        {getTitle()}
      </Button>
    </form>
  );
};

export { TradeForm, useTradeForm, TradeFormProvider };
