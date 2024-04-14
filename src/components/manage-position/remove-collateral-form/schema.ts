import * as yup from "yup";

import type { Token } from "@4x.pro/app-config";

type SubmitData = {
  receiveToken: Token;
  withdrawalAmount: number;
};

const submitDataSchema = yup.object<SubmitData>().shape({
  receiveToken: yup.string().oneOf<Token>(["SOL", "USDC", "BTC"]).required(),
  withdrawalAmount: yup.number().moreThan(0).required(),
});

export type { SubmitData };
export { submitDataSchema };
