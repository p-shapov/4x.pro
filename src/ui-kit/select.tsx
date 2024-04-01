"use client";
import { Listbox } from "@headlessui/react";
import cn from "classnames";
import type { FC, ReactNode } from "react";

import { mkSelectStyles } from "@4x.pro/shared/styles/select";
import type { PropsWithStyles } from "@4x.pro/shared/types";

import { Icon } from "./icon";

type Props = {
  options: {
    value: string;
    content: ReactNode;
  }[];
  value?: string;
  readonly?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

const Select: FC<PropsWithStyles<Props, typeof mkSelectStyles>> = ({
  options,
  inline,
  popoverPosition,
  readonly,
  ...rest
}) => {
  const selectStyles = mkSelectStyles({ inline, popoverPosition });
  return (
    <div className={selectStyles.root}>
      <Listbox {...rest} disabled={readonly || options.length === 1}>
        <Listbox.Button className={cn(selectStyles.inputWrap, "w-max")}>
          {({ value, open }) => {
            const current = options.find((opt) => opt.value === value);
            return (
              <div
                className={cn({
                  [cn(selectStyles.option, selectStyles.optionInactive)]:
                    !inline,
                  [cn(selectStyles.optionInline)]: inline,
                })}
              >
                <span className={selectStyles.optionText}>
                  {current?.content}
                </span>
                {options.length > 1 && (
                  <span className={selectStyles.postfix}>
                    <Icon
                      className={selectStyles.icon}
                      src={
                        open
                          ? "/icons/arrow-up-1.svg"
                          : "/icons/arrow-down-1.svg"
                      }
                    />
                  </span>
                )}
              </div>
            );
          }}
        </Listbox.Button>
        <Listbox.Options
          className={cn(selectStyles.options, selectStyles.popover)}
        >
          {options.map((option) => (
            <Listbox.Option
              key={option.value}
              value={option.value}
              className={({ active, selected }) =>
                cn(selectStyles.option, {
                  [selectStyles.optionActive]: active,
                  [selectStyles.optionSelected]: selected,
                  [selectStyles.optionInactive]: !selected && !active,
                })
              }
            >
              <span className={selectStyles.optionText}>{option.content}</span>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};

export { Select };
