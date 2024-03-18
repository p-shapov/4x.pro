"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";

import { Button } from "@4x.pro/ui-kit/button";

import { ClosingOptions } from "./closing-options";
import { Leverage } from "./leverage";
import { Position } from "./position";
import type { SubmitData } from "./schema";
import { submitDataSchema } from "./schema";
import { Slippage } from "./slippage";
import { mkTradeFormStyles } from "./styles";

type Token = {
  account: string;
  symbol: string;
  uri: string;
};

type Props = {
  form: UseFormReturn<SubmitData>;
  title: string;
  baseTokenList: Token[];
  quoteToken: Token;
};

const useTradeForm = () => {
  const form = useForm<SubmitData>({
    defaultValues: {
      leverage: 1.1,
      slippage: 0.5,
    },
    resolver: yupResolver(submitDataSchema),
  });
  return form;
};

const TradeForm: FC<Props> = ({ title, form, baseTokenList, quoteToken }) => {
  const tradeFormStyles = mkTradeFormStyles();
  const handleSubmit = form.handleSubmit((data) => {
    console.log(data);
  });
  return (
    <form className={tradeFormStyles.root} onSubmit={handleSubmit}>
      <Position
        form={form}
        baseTokenList={baseTokenList}
        quoteToken={quoteToken}
      />
      <Leverage form={form} />
      <Slippage form={form} />
      <ClosingOptions form={form} />
      <Button type="submit" variant="primary">
        {title}
      </Button>
    </form>
  );
};

export { TradeForm, useTradeForm };
