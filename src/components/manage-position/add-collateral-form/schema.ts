import * as yup from "yup";

import type { Token } from "@4x.pro/configs/dex-platform";
import { tokenList } from "@4x.pro/configs/dex-platform";

type SubmitData = {
  collateral: {
    deposit: number;
    token: Token;
  };
};

const submitDataSchema = yup.object<SubmitData>().shape({
  collateral: yup
    .object()
    .shape({
      deposit: yup.number().moreThan(0).required(),
      token: yup.string().oneOf<Token>(tokenList).required(),
    })
    .required(),
});

export type { SubmitData };
export { submitDataSchema };
