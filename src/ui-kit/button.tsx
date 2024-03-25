"use client";
import type { FC, PropsWithChildren } from "react";

import type { PropsWithStyles } from "@4x.pro/shared/types";

import { mkButtonStyles } from "../shared/styles/button";

type Props = {
  type?: "button" | "submit";
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
  ...rest
}) => {
  const buttonStyles = mkButtonStyles({ variant, outlined, fill, size });
  return (
    <button className={buttonStyles.root} type={type} {...rest}>
      {children}
    </button>
  );
};

export { Button };
