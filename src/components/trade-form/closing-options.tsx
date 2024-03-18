import type { FC } from "react";
import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import { NumberField } from "@promo-shock/ui-kit/number-field";

import type { SubmitData } from "./schema";
import { mkClosingOptionsStyles } from "./styles";

type Props = {
  form: UseFormReturn<SubmitData>;
};

const ClosingOptions: FC<Props> = ({ form }) => {
  const closingOptionsStyles = mkClosingOptionsStyles();
  return (
    <fieldset className={closingOptionsStyles.root}>
      <Controller<SubmitData, "takeProfit">
        name="takeProfit"
        control={form.control}
        render={({ field: { onChange } }) => (
          <NumberField
            label="Take profit"
            placeholder="0.00"
            postfix="$"
            onChange={onChange}
          />
        )}
      />
      <Controller<SubmitData, "stopLoss">
        name="stopLoss"
        control={form.control}
        render={({ field: { onChange } }) => (
          <NumberField
            label="Stop loss"
            placeholder="0.00"
            postfix="$"
            onChange={onChange}
          />
        )}
      />
    </fieldset>
  );
};

export { ClosingOptions };
