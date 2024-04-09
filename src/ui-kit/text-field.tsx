"use client";
import { useId } from "react";
import type { ChangeEvent, FC, ReactNode } from "react";

import { mkFieldStyles } from "@4x.pro/shared/styles/field";
import type { PropsWithStyles } from "@4x.pro/shared/types";

import { Tooltip } from "./tooltip";

type Props = {
  label?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  postfix?: ReactNode;
  labelTooltip?: {
    message: ReactNode;
    icon?: "question";
    width?: number;
  };
  readonly?: boolean;
  onFocus?: () => void;
  onChange?: (value: string) => void;
};

const TextField: FC<PropsWithStyles<Props, typeof mkFieldStyles>> = ({
  label,
  postfix,
  onChange,
  error,
  labelTooltip,
  ...rest
}) => {
  const id = useId();
  const fieldStyles = mkFieldStyles({ error });
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };
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
        <input
          id={id}
          className={fieldStyles.input}
          onChange={handleChange}
          {...rest}
        />
        {postfix && <span className={fieldStyles.postfix}>{postfix}</span>}
      </span>
    </div>
  );
};

export { TextField };
