import * as yup from "yup";

import type { Coin } from "@4x.pro/app-config";
import { coinList } from "@4x.pro/app-config";

type SubmitData = {
  slippage: number;
  receiveToken: Coin;
};

const submitDataSchema = yup.object<SubmitData>().shape({
  slippage: yup.number().required().moreThan(0),
  receiveToken: yup.string().required().oneOf(coinList),
});

export { submitDataSchema };
export type { SubmitData };
