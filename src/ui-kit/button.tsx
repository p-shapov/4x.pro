"use client";
import type { FC, PropsWithChildren } from "react";

import type { PropsWithStyles } from "@4x.pro/shared/types";

import { Icon } from "./icon";
import { mkButtonStyles } from "../shared/styles/button";

type Props = {
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
};

const Button: FC<
  PropsWithChildren<PropsWithStyles<Props, typeof mkButtonStyles>>
> = ({
  children,
  variant = "primary",
  outlined = false,
  type = "button",
  fill = true,
  size = "md",
  disabled = false,
  loading = false,
  ...rest
}) => {
  const buttonStyles = mkButtonStyles({
    variant,
    outlined,
    fill,
    size,
    disabled,
    loading,
  });
  return (
    <button
      className={buttonStyles.root}
      type={type}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className={buttonStyles.spinner}>
          <Icon src="/icons/spinner.svg" className={buttonStyles.spinnerIcon} />
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export { Button };
