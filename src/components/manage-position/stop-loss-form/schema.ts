import * as yup from "yup";

type SubmitData = {
  triggerPrice: number;
};

const submitDataSchema = yup
  .object<SubmitData>()
  .shape({
    triggerPrice: yup.number().moreThan(0).required(),
  })
  .required();

export type { SubmitData };
export { submitDataSchema };
