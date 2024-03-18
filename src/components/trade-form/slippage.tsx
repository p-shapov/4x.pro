import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";

import { formatPercentage } from "@promo-shock/shared/utils/number";
import { NumberField } from "@promo-shock/ui-kit/number-field";
import { Presets } from "@promo-shock/ui-kit/presets";

import type { SubmitData } from "./schema";
import { mkSlippageStyles } from "./styles";

type Props = {
  form: UseFormReturn<SubmitData>;
};

const Slippage: FC<Props> = ({ form }) => {
  const slippageStyles = mkSlippageStyles();
  return (
    <fieldset className={slippageStyles.root}>
      <span className={slippageStyles.label}>Slippage Tolerance</span>
      <div className={slippageStyles.field}>
        <Controller<SubmitData, "slippage">
          name="slippage"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <NumberField
              value={value}
              min={0}
              max={1}
              step={0.1}
              postfix="%"
              onChange={onChange}
            />
          )}
        />
      </div>
      <Controller<SubmitData, "slippage">
        name="slippage"
        control={form.control}
        render={({ field: { value, onChange } }) => (
          <Presets
            options={[0.1, 0.5, 0.8]}
            value={value}
            onChange={onChange}
            formatValue={(value) => formatPercentage(value, 1)}
          />
        )}
      />
    </fieldset>
  );
};

export { Slippage };
