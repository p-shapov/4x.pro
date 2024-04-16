import * as yup from "yup";

import { tokenList } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";

type SubmitData = {
  receiveToken: Token;
  withdrawalAmount: number;
};

const submitDataSchema = yup.object<SubmitData>().shape({
  receiveToken: yup.string().oneOf<Token>(tokenList).required(),
  withdrawalAmount: yup.number().moreThan(0).required(),
});

export type { SubmitData };
export { submitDataSchema };
