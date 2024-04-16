import * as yup from "yup";

import type { Coin } from "@4x.pro/app-config";
import { coinList } from "@4x.pro/app-config";

type SubmitData = {
  pay: {
    amount: number;
    token: Coin;
  };
  slippage: number;
};

const submitDataSchema = yup.object<SubmitData>().shape({
  pay: yup
    .object()
    .shape({
      amount: yup.number().min(0).required(),
      token: yup.string().required().oneOf(coinList),
    })
    .required(),
  slippage: yup.number().min(0.1).max(0.8).required(),
});

export type { SubmitData };
export { submitDataSchema };
