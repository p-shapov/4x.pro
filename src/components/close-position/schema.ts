import * as yup from "yup";

import type { Token } from "@4x.pro/app-config";
import { tokenList } from "@4x.pro/app-config";

type SubmitData = {
  slippage: number;
  receiveToken: Token;
};

const submitDataSchema = yup.object<SubmitData>().shape({
  slippage: yup.number().required().moreThan(0),
  receiveToken: yup.string().required().oneOf(tokenList),
});

export { submitDataSchema };
export type { SubmitData };
