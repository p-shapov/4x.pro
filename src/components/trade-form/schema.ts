import * as yup from "yup";

type Token = {
  account: string;
  value: number;
};

type SubmitData = {
  position: {
    base: Token;
    quote: Token;
  };
  leverage: number;
  slippage: number;
  takeProfit?: number;
  stopLoss?: number;
};

const submitDataSchema = yup.object<SubmitData>().shape({
  position: yup.object().shape({
    base: yup.object().shape({
      account: yup.string().required(),
      value: yup.number().min(1).required(),
    }),
    quote: yup.object().shape({
      account: yup.string().required(),
      value: yup.number().min(1).required(),
    }),
  }),
  leverage: yup.number().min(1.1).max(100).required(),
  slippage: yup.number().min(0.1).max(0.8).required(),
  takeProfit: yup.number(),
  stopLoss: yup.number(),
});

export type { SubmitData };
export { submitDataSchema };
