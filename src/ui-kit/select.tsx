"use client";
import { Listbox } from "@headlessui/react";
import cn from "classnames";
import type { FC, ReactNode } from "react";

import { mkFieldStyles } from "@promo-shock/shared/styles/field";
import type { PropsWithStyles } from "@promo-shock/shared/types";

import { Icon } from "./icon";

type Props = {
  options: {
    value: string;
    content: ReactNode;
  }[];
  label?: string;
  value?: string;
  readonly?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

const Select: FC<PropsWithStyles<Props, typeof mkFieldStyles>> = ({
  options,
  label,
  outlined,
  size,
  popoverPosition,
  readonly,
  ...rest
}) => {
  const fieldStyles = mkFieldStyles({ outlined, size, popoverPosition });
  return (
    <div className={fieldStyles.root}>
      {label && (
        <Listbox.Label className={fieldStyles.label}>{label}</Listbox.Label>
      )}
      <Listbox {...rest} disabled={readonly}>
        <Listbox.Button className={fieldStyles.inputWrap}>
          {({ value, open }) => {
            const current = options.find((opt) => opt.value === value);
            return (
              <div
                className={cn(fieldStyles.option, fieldStyles.optionInactive)}
              >
                <span className={fieldStyles.optionText}>
                  {current?.content}
                </span>
                <span className={fieldStyles.postfix}>
                  <Icon
                    className={fieldStyles.icon}
                    src={
                      open ? "/icons/arrow-up-1.svg" : "/icons/arrow-down-1.svg"
                    }
                  />
                </span>
              </div>
            );
          }}
        </Listbox.Button>
        <Listbox.Options
          className={cn(fieldStyles.options, fieldStyles.popover)}
        >
          {options.map((option) => (
            <Listbox.Option
              key={option.value}
              value={option.value}
              className={({ active, selected }) =>
                cn(fieldStyles.option, {
                  [fieldStyles.optionActive]: active,
                  [fieldStyles.optionSelected]: selected,
                  [fieldStyles.optionInactive]: !selected && !active,
                })
              }
            >
              <span className={fieldStyles.optionText}>{option.content}</span>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};

export { Select };
