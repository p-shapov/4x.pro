import * as yup from "yup";

import { coinList } from "@4x.pro/app-config";
import type { Coin } from "@4x.pro/app-config";

type SubmitData = {
  receiveToken: Coin;
  withdrawalAmount: number;
};

const submitDataSchema = yup.object<SubmitData>().shape({
  receiveToken: yup.string().oneOf<Coin>(coinList).required(),
  withdrawalAmount: yup.number().moreThan(0).required(),
});

export type { SubmitData };
export { submitDataSchema };
