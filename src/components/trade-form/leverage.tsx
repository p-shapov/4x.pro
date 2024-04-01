"use client";

import type { FC } from "react";
import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import { formatRate } from "@4x.pro/shared/utils/number";
import { NumberField } from "@4x.pro/ui-kit/number-field";
import { Presets } from "@4x.pro/ui-kit/presets";
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
      <span className={leverageStyles.label}>Leverage</span>
      <div className={leverageStyles.field}>
        <Controller<SubmitData, "leverage">
          name="leverage"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <NumberField
              value={value || ""}
              min={1.1}
              max={100}
              step={0.1}
              placeholder="0.00"
              error={!!errors.leverage}
              onChange={onChange}
            />
          )}
        />
      </div>
      <Controller<SubmitData, "leverage">
        name="leverage"
        control={form.control}
        render={({ field: { value, onChange } }) => (
          <Presets
            options={[25, 50, 75, 100]}
            value={value}
            onChange={onChange}
            formatValue={(value) => formatRate(value, 0)}
          />
        )}
      />
      <div className={leverageStyles.range}>
        <Controller<SubmitData, "leverage">
          name="leverage"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <RangeSlider
              value={value}
              min={1.1}
              max={100}
              step={0.1}
              tickStep={3.6}
              onChange={onChange}
              formatValue={(value) => formatRate(value, 1)}
            />
          )}
        />
      </div>
    </fieldset>
  );
};

export { Leverage };
