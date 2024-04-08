"use client";
import type { FC } from "react";
import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import { formatRate } from "@4x.pro/shared/utils/number";
import { NumberField } from "@4x.pro/ui-kit/number-field";
import { RangeSlider } from "@4x.pro/ui-kit/range-slider";

import type { SubmitData } from "./schema";
import { mkLeverageStyles } from "./styles";

type Props = {
  form: UseFormReturn<SubmitData>;
};

const Leverage: FC<Props> = ({ form }) => {
  const leverageStyles = mkLeverageStyles();
  const errors = form.formState.errors;
  return (
    <fieldset className={leverageStyles.root}>
      <Controller<SubmitData, "leverage">
        name="leverage"
        control={form.control}
        render={({ field: { value, onChange } }) => (
          <NumberField
            value={value || ""}
            min={1}
            max={100}
            step={0.1}
            label="Leverage"
            placeholder="0.00"
            error={!!errors.leverage}
            onChange={onChange}
            postfix="x"
            presets={[25, 50, 75, 100]}
            formatValue={(value) => formatRate(value, 0)}
          />
        )}
      />
      <Controller<SubmitData, "leverage">
        name="leverage"
        control={form.control}
        render={({ field: { value, onChange } }) => (
          <RangeSlider
            value={value}
            min={1}
            max={25}
            step={0.1}
            tickStep={1}
            onChange={onChange}
            formatValue={(value) => formatRate(value, 1)}
          />
        )}
      />
    </fieldset>
  );
};

export { Leverage };
