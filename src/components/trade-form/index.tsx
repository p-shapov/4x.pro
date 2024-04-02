"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";

import type { Token } from "@4x.pro/app-config";
import { useIsInsufficientBalance } from "@4x.pro/shared/hooks/use-token-balance";
import { Button } from "@4x.pro/ui-kit/button";

import { Leverage } from "./leverage";
import { Position } from "./position";
import { TradeFormProvider } from "./provider";
import type { SubmitData } from "./schema";
import { submitDataSchema } from "./schema";
import { Slippage } from "./slippage";
import { mkTradeFormStyles } from "./styles";
import { TriggerPrice } from "./trigger-price";
import { Wallet } from "../wallet";

type Props = {
  form: UseFormReturn<SubmitData>;
  side: "short" | "long";
  collateralTokens: readonly Token[];
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

const TradeForm: FC<Props> = ({ side, form, collateralTokens }) => {
  const tradeFormStyles = mkTradeFormStyles();
  const handleSubmit = form.handleSubmit((data) => {
    alert(JSON.stringify(data));
  });
  const position = useWatch({
    control: form.control,
    name: "position.base",
  });
  const { connected } = useWallet();
  const isInsufficientBalance = useIsInsufficientBalance({
    token: position.token,
    amount: position.size,
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
    <form className={tradeFormStyles.root} onSubmit={handleSubmit} noValidate>
      <Position form={form} collateralTokens={collateralTokens} />
      <Leverage form={form} />
      <Slippage form={form} />
      <TriggerPrice form={form} />
      {!connected ? (
        <Wallet.Connect variant={getButtonVariant()} />
      ) : (
        <Button
          type={connected ? "submit" : "button"}
          variant={getButtonVariant()}
          disabled={isInsufficientBalance.data}
        >
          {getTitle()}
        </Button>
      )}
    </form>
  );
};

export { TradeForm, useTradeForm, TradeFormProvider };
