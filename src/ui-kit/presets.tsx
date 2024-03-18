import { RadioGroup } from "@headlessui/react";
import type { FC } from "react";

import { mkPresetsStyles } from "@promo-shock/shared/styles/presets";
import type { Formatter } from "@promo-shock/shared/utils/number";
import { formatIdentity } from "@promo-shock/shared/utils/number";

type Props = {
  options: number[];
  value?: number;
  defaultValue?: number;
  formatValue?: Formatter;
  onChange?: (value: number) => void;
};

const Presets: FC<Props> = ({
  value,
  defaultValue,
  options,
  formatValue = formatIdentity,
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
