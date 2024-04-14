import * as yup from "yup";

import type { Token } from "@4x.pro/app-config";
import { tokenList } from "@4x.pro/app-config";

type SubmitData = {
  lpAmount: number;
  receiveToken: Token;
  slippage: number;
};

const submitDataSchema = yup.object<SubmitData>().shape({
  lpAmount: yup.number().min(0).required(),
  receiveToken: yup.string().required().oneOf(tokenList),
  slippage: yup.number().min(0.1).max(0.8).required(),
});

export type { SubmitData };
export { submitDataSchema };
