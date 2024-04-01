import * as yup from "yup";

import type { Token } from "@4x.pro/configs/dex-platform";

type SubmitData = {
  collateral: {
    withdrawal: number;
    token: Token;
  };
};

const submitDataSchema = yup.object<SubmitData>().shape({
  collateral: yup
    .object()
    .shape({
      withdrawal: yup.number().moreThan(0).required(),
      token: yup.string().oneOf<Token>(["BTC", "ETH", "USDC"]).required(),
    })
    .required(),
});

export type { SubmitData };
export { submitDataSchema };
