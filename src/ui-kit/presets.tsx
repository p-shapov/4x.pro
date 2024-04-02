"use client";
import { RadioGroup } from "@headlessui/react";
import type { FC } from "react";

import { mkPresetsStyles } from "@4x.pro/shared/styles/presets";
import type { Formatter } from "@4x.pro/shared/utils/number";
import { formatDefault } from "@4x.pro/shared/utils/number";

type Props = {
  options: number[];
  value?: number | "";
  defaultValue?: number | "";
  formatValue?: Formatter;
  onChange?: (value: number) => void;
};

const Presets: FC<Props> = ({
  value,
  defaultValue,
  options,
  formatValue = formatDefault,
  onChange,
}) => {
  const presetsStyles = mkPresetsStyles();
  return (
    <RadioGroup
      value={value}
      defaultValue={defaultValue}
      className={presetsStyles.root}
      onChange={onChange}
    >
      {options.map((value, idx) => (
        <RadioGroup.Option
          key={idx}
          value={value}
          className={presetsStyles.option}
        >
          {formatValue(value)}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
};

export { Presets };
