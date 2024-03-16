"use client";
import type { FC, PropsWithChildren } from "react";

import type { PropsWithStyles } from "@promo-shock/shared/types";

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
  ...rest
}) => {
  const buttonStyles = mkButtonStyles({ variant, outlined });
  return (
    <button className={buttonStyles.root} type={type} {...rest}>
      {children}
    </button>
  );
};

export { Button };
