"use client";
import { useId } from "react";
import type { ChangeEvent, FC, ReactNode } from "react";

import { mkFieldStyles } from "@promo-shock/shared/styles/field";
import type { PropsWithStyles } from "@promo-shock/shared/types";

type Props = {
  label?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  postfix?: ReactNode;
  readonly?: boolean;
  onChange?: (value: string) => void;
};

const TextField: FC<PropsWithStyles<Props, typeof mkFieldStyles>> = ({
  label,
  postfix,
  outlined = true,
  size = "md",
  onChange,
  ...rest
}) => {
  const id = useId();
  const fieldStyles = mkFieldStyles({ outlined, size });
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
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
