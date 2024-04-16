import * as yup from "yup";

import type { Coin } from "@4x.pro/app-config";
import { coinList } from "@4x.pro/app-config";

type SubmitData = {
  lpAmount: number;
  receiveToken: Coin;
  slippage: number;
};

const submitDataSchema = yup.object<SubmitData>().shape({
  lpAmount: yup.number().min(0).required(),
  receiveToken: yup.string().required().oneOf(coinList),
  slippage: yup.number().min(0.1).max(0.8).required(),
});

export type { SubmitData };
export { submitDataSchema };
