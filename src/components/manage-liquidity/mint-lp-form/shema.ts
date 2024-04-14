import * as yup from "yup";

import type { Token } from "@4x.pro/app-config";
import { tokenList } from "@4x.pro/app-config";

type SubmitData = {
  pay: {
    amount: number;
    token: Token;
  };
  slippage: number;
};

const submitDataSchema = yup.object<SubmitData>().shape({
  pay: yup
    .object()
    .shape({
      amount: yup.number().min(0).required(),
      token: yup.string().required().oneOf(tokenList),
    })
    .required(),
  slippage: yup.number().min(0.1).max(0.8).required(),
});

export type { SubmitData };
export { submitDataSchema };
