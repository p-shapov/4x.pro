import * as yup from "yup";

type SubmitData = {
  depositAmount: number;
};

const submitDataSchema = yup.object<SubmitData>().shape({
  depositAmount: yup.number().moreThan(0).required(),
});

export type { SubmitData };
export { submitDataSchema };
