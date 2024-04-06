import * as yup from "yup";

import { tokenList } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";

type SubmitData = {
  position: {
    base: {
      token: Token;
      size: number;
    };
    quote: {
      token: Token;
      size: number;
    };
  };
  leverage: number;
  slippage: number;
  takeProfit?: number | undefined;
  stopLoss?: number | undefined;
};

const submitDataSchema = yup.object<SubmitData>().shape({
  position: yup.object().shape({
    base: yup.object().shape({
      token: yup.string().required().oneOf(tokenList),
      size: yup.number().required().moreThan(0),
    }),
    quote: yup.object().shape({
      token: yup.string().required().oneOf(tokenList),
      size: yup.number().required().moreThan(0),
    }),
  }),
  leverage: yup.number().min(1.1).max(100).required(),
  slippage: yup.number().min(0.1).max(0.8).required(),
  takeProfit: yup.lazy((value) =>
    value === ""
      ? yup.number().transform(() => undefined)
      : yup.number().moreThan(0),
  ),
  stopLoss: yup.lazy((value) =>
    value === ""
      ? yup.number().transform(() => undefined)
      : yup.number().moreThan(0),
  ),
});

export type { SubmitData };
export { submitDataSchema };
