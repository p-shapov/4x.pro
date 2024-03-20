import * as yup from "yup";

import { tokenList } from "@4x.pro/configs/token-config";
import type { Token } from "@4x.pro/configs/token-config";

type SubmitData = {
  position: {
    base: {
      token: Token;
      amount: number;
    };
    quote: {
      token: Token;
      amount: number;
    };
  };
  leverage: number;
  slippage: number;
  takeProfit?: number;
  stopLoss?: number;
};

const submitDataSchema = yup.object<SubmitData>().shape({
  position: yup.object().shape({
    base: yup.object().shape({
      token: yup.string().required().oneOf(tokenList),
      amount: yup.number().required().min(1),
    }),
    quote: yup.object().shape({
      token: yup.string().required().oneOf(tokenList),
      amount: yup.number().required().min(1),
    }),
  }),
  leverage: yup.number().min(1.1).max(100).required(),
  slippage: yup.number().min(0.1).max(0.8).required(),
  takeProfit: yup.number(),
  stopLoss: yup.number(),
});

export type { SubmitData };
export { submitDataSchema };
