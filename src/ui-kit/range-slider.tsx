"use client";
import cn from "classnames";
import { useId, useState } from "react";
import type { ChangeEvent, FC } from "react";

import { mkRangeStyles } from "@promo-shock/shared/styles/range";
import type { Formatter } from "@promo-shock/shared/utils/number";
import { formatIdentity } from "@promo-shock/shared/utils/number";

type Props = {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  formatValue?: Formatter;
};

const RangeSlider: FC<Props> = ({
  min = 0,
  max = 100,
  step = 5,
  defaultValue = 0,
  onChange,
  formatValue = formatIdentity,
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
  return (
    <div className={rangeStyles.root}>
      <span className={rangeStyles.label}>{formatValue(min)}</span>
      <div className={rangeStyles.inputWrap}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          defaultValue={rest.value ? undefined : defaultValue}
          onChange={handleChange}
          list={listId}
          className={cn(rangeStyles.input, rangeStyles.thumb)}
          {...rest}
        />
        <datalist id={listId} className={rangeStyles.datalist}>
          {Array.from({ length: (max - min) / step }).map((_, i) => (
            <option
              key={i}
              value={min + i * step}
              className={cn(rangeStyles.tick, {
                [rangeStyles.tickInRange]: min + i * step < value,
                [rangeStyles.tickOutOfRange]: min + i * step >= value,
              })}
            />
          ))}
        </datalist>
      </div>
      <span className={rangeStyles.label}>{formatValue(max)}</span>
    </div>
  );
};

export { RangeSlider };
