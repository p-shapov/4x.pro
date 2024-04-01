"use client";
import cn from "classnames";
import { useId } from "react";
import type { ChangeEvent, FC, ReactNode } from "react";

import { mkFieldStyles } from "@4x.pro/shared/styles/field";
import type { PropsWithStyles } from "@4x.pro/shared/types";

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
  onFocus?: () => void;
  onChange?: (value: number | "") => void;
};

const NumberField: FC<PropsWithStyles<Props, typeof mkFieldStyles>> = ({
  label,
  postfix,
  error,
  onChange,
  ...rest
}) => {
  const id = useId();
  const fieldStyles = mkFieldStyles({ error });
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(Number(event.target.value) || "");
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
          onChange={handleChange}
          {...rest}
        />
        {postfix && <span className={fieldStyles.postfix}>{postfix}</span>}
      </span>
    </div>
  );
};

export { NumberField };
