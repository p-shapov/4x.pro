"use client";
import cn from "classnames";
import { useId } from "react";
import type { ChangeEvent, FC, ReactNode } from "react";

import { mkFieldStyles } from "@4x.pro/shared/styles/field";
import type { PropsWithStyles } from "@4x.pro/shared/types";
import type { Formatter } from "@4x.pro/shared/utils/number";

import { Presets } from "./presets";

type Props = {
  label?: string;
  value?: number | "";
  defaultValue?: number | "";
  placeholder?: string;
  postfix?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  readonly?: boolean;
  presets?: number[];
  formatValue?: Formatter;
  mapPreset?: (value: number) => number;
  onFocus?: () => void;
  onChange?: (value: number | "") => void;
};

const NumberField: FC<PropsWithStyles<Props, typeof mkFieldStyles>> = ({
  label,
  postfix,
  error,
  onChange,
  formatValue,
  presets,
  value,
  defaultValue,
  mapPreset = (value) => value,
  ...rest
}) => {
  const id = useId();
  const fieldStyles = mkFieldStyles({ error });
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!/^[0.]*$/.test(event.target.value)) {
      onChange?.(Number(event.target.value));
    }
  };
  const handlePresetsChange = (value: number) => {
    onChange?.(mapPreset(value));
  };
  return (
    <div className={fieldStyles.root}>
      {label && (
        <label htmlFor={id} className={fieldStyles.label}>
          {label}
        </label>
      )}
      <span className={fieldStyles.inputWrap}>
        <input
          id={id}
          type="number"
          className={cn(
            "[-moz-appearance:_textfield]",
            "[&::-webkit-outer-spin-button]:m-0",
            "[&::-webkit-outer-spin-button]:appearance-none",
            "[&::-webkit-inner-spin-button]:m-0",
            "[&::-webkit-inner-spin-button]:appearance-none",
            fieldStyles.input,
          )}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          {...rest}
        />
        {postfix && <span className={fieldStyles.postfix}>{postfix}</span>}
        {presets && (
          <Presets
            options={presets}
            onChange={handlePresetsChange}
            formatValue={formatValue}
          />
        )}
      </span>
    </div>
  );
};

export { NumberField };
