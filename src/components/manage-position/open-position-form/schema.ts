import * as yup from "yup";

import { coinList } from "@4x.pro/app-config";
import type { Coin } from "@4x.pro/app-config";

type SubmitData = {
  position: {
    base: {
      token: Coin;
      size: number;
    };
    quote: {
      token: Coin;
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
      token: yup.string().required().oneOf(coinList),
      size: yup.number().required().moreThan(0),
    }),
    quote: yup.object().shape({
      token: yup.string().required().oneOf(coinList),
      size: yup.number().required().moreThan(0),
    }),
  }),
  leverage: yup.number().min(1).max(100).required(),
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
