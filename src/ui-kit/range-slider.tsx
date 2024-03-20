"use client";
import cn from "classnames";
import { useEffect, useId, useState } from "react";
import type { ChangeEvent, FC } from "react";

import { mkRangeStyles } from "@4x.pro/shared/styles/range";
import type { Formatter } from "@4x.pro/shared/utils/number";
import { formatDefault } from "@4x.pro/shared/utils/number";

type Props = {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  tickStep?: number;
  onChange?: (value: number) => void;
  formatValue?: Formatter;
};

const RangeSlider: FC<Props> = ({
  min = 0,
  max = 100,
  step = 5,
  tickStep = step,
  defaultValue = 0,
  onChange,
  formatValue = formatDefault,
  ...rest
}) => {
  const rangeStyles = mkRangeStyles();
  const [value, setValue] = useState<number>(rest.value || defaultValue || min);
  const listId = useId();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    onChange?.(newValue);
  };
  const mkHandleClickLabel = (value: number) => () => {
    setValue(value);
    onChange?.(value);
  };
  useEffect(() => {
    if (typeof rest.value !== "undefined") {
      setValue(rest.value);
    }
  }, [rest.value]);
  return (
    <div className={rangeStyles.root}>
      <span className={rangeStyles.label} onClick={mkHandleClickLabel(min)}>
        {formatValue(min)}
      </span>
      <div className={rangeStyles.inputWrap}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          defaultValue={
            typeof rest.value !== "undefined" ? undefined : defaultValue
          }
          onChange={handleChange}
          list={listId}
          className={cn(rangeStyles.input, rangeStyles.thumb)}
          {...rest}
        />
        <div className={rangeStyles.datalist}>
          {Array.from({ length: Math.ceil((max - min) / tickStep) + 1 }).map(
            (_, i) => (
              <span
                key={i}
                className={cn(rangeStyles.tick, {
                  [rangeStyles.tickInRange]: min + i * tickStep < value,
                  [rangeStyles.tickOutOfRange]: min + i * tickStep >= value,
                })}
              />
            ),
          )}
        </div>
      </div>
      <span className={rangeStyles.label} onClick={mkHandleClickLabel(max)}>
        {formatValue(max)}
      </span>
    </div>
  );
};

export { RangeSlider };
