import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";

import { formatPercentage } from "@4x.pro/shared/utils/number";
import { NumberField } from "@4x.pro/ui-kit/number-field";

import type { SubmitData } from "./schema";
import { mkSlippageStyles } from "./styles";

type Props = {
  form: UseFormReturn<SubmitData>;
};

const Slippage: FC<Props> = ({ form }) => {
  const slippageStyles = mkSlippageStyles();
  const errors = form.formState.errors;
  return (
    <fieldset className={slippageStyles.root}>
      <Controller<SubmitData, "slippage">
        name="slippage"
        control={form.control}
        render={({ field: { value, onChange } }) => (
          <NumberField
            value={value}
            label="Slippage Tolerance"
            placeholder="0.00"
            unit="%"
            presets={[0.1, 0.5, 0.8]}
            formatValue={(value) => formatPercentage(value, 1)}
            onChange={onChange}
            error={!!errors.slippage}
          />
        )}
      />
    </fieldset>
  );
};

export { Slippage };
