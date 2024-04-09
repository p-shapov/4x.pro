import type { FC } from "react";
import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import { NumberField } from "@4x.pro/ui-kit/number-field";

import type { SubmitData } from "./schema";
import { mkTriggerPriceStyles } from "./styles";

type Props = {
  form: UseFormReturn<SubmitData>;
};

const TriggerPrice: FC<Props> = ({ form }) => {
  const errors = form.formState.errors;
  const triggerPriceStyles = mkTriggerPriceStyles();
  return (
    <fieldset className={triggerPriceStyles.root}>
      <Controller<SubmitData, "takeProfit">
        name="takeProfit"
        control={form.control}
        render={({ field: { value, onChange } }) => (
          <NumberField
            label="Take profit"
            placeholder="0.00"
            unit="$"
            value={value}
            onChange={onChange}
            error={!!errors.takeProfit}
            labelTooltip={{
              message:
                "A Take Profit (TP) is an instruction to close a trade at a specific rate if the market rises, to ensure your profit is realized and goes to your available balance.",
              width: 240,
            }}
          />
        )}
      />
      <Controller<SubmitData, "stopLoss">
        name="stopLoss"
        control={form.control}
        render={({ field: { value, onChange } }) => (
          <NumberField
            label="Stop loss"
            placeholder="0.00"
            unit="$"
            value={value}
            onChange={onChange}
            error={!!errors.stopLoss}
            labelTooltip={{
              message:
                "A Take Profit (TP) is an instruction to close a trade at a specific rate if the market rises, to ensure your profit is realized and goes to your available balance.",
              width: 240,
            }}
          />
        )}
      />
    </fieldset>
  );
};

export { TriggerPrice };
