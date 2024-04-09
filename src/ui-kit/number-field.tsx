/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { useNumberFormat } from "@react-input/number-format";
import cn from "classnames";
import { useEffect, useId, useState } from "react";
import type { ChangeEvent, FC, ReactNode } from "react";

import { mkFieldStyles } from "@4x.pro/shared/styles/field";
import type { PropsWithStyles } from "@4x.pro/shared/types";
import type { Formatter } from "@4x.pro/shared/utils/number";

import { Presets } from "./presets";
import { Tooltip } from "./tooltip";

type Props = {
  label?: string;
  value?: number;
  placeholder?: string;
  readonly?: boolean;
  presets?: number[];
  formatValue?: Formatter;
  labelTooltip?: {
    message: ReactNode;
    icon?: "question";
    width?: number;
  };
  unit?: string;
  mapPreset?: (value: number) => number;
  onFocus?: () => void;
  onChange?: (value: number) => void;
};

const NumberField: FC<
  PropsWithStyles<Props, typeof mkFieldStyles, "notEmpty">
> = ({
  label,
  error,
  onChange,
  formatValue,
  presets,
  value,
  labelTooltip,
  unit,
  mapPreset = (value) => value,
  ...rest
}) => {
  const inputRef = useNumberFormat({
    locales: "en",
    maximumFractionDigits: 20,
  });
  const [inputValue, setInputValue] = useState((value || "").toString());
  const id = useId();
  const fieldStyles = mkFieldStyles({ error, notEmpty: !!value });
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (/^(\d{1,3}(,\d{3})*|\d+)(\.\d*[1-9])?$/.test(event.target.value)) {
      onChange?.(Number(event.target.value.replaceAll(",", "")));
    }
    if (event.target.value === "") {
      onChange?.(0);
    }
  };
  const handlePresetsChange = (value: number) => {
    setInputValue(
      new Intl.NumberFormat("en", {
        maximumFractionDigits: 20,
      }).format(value),
    );
    onChange?.(mapPreset(value));
  };
  useEffect(() => {
    setInputValue(
      value
        ? new Intl.NumberFormat("en", {
            maximumFractionDigits: 20,
          }).format(value)
        : "",
    );
  }, [value]);
  return (
    <div className={fieldStyles.root}>
      {label && (
        <label htmlFor={id} className={fieldStyles.label}>
          <span className="inline-flex">
            <span>{label}</span>
            {labelTooltip && (
              <span className={fieldStyles.labelTooltip}>
                <Tooltip
                  icon={labelTooltip.icon}
                  message={labelTooltip.message}
                  width={labelTooltip.width}
                />
              </span>
            )}
          </span>
        </label>
      )}
      <span className={fieldStyles.inputWrap}>
        <span className={fieldStyles.fieldWrap}>
          <span className={fieldStyles.fakeInput}>{inputValue}</span>
          <input
            ref={inputRef}
            id={id}
            className={cn(fieldStyles.input)}
            value={inputValue}
            onChange={handleChange}
            size={1}
            style={{
              minWidth: !inputValue
                ? `${rest.placeholder?.length || 1}ch`
                : undefined,
            }}
            {...rest}
          />
          {unit && <span className={fieldStyles.postfix}>{` ${unit}`}</span>}
        </span>
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
