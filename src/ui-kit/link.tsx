import NextLink from "next/link";
import type { FC } from "react";

import { mkLinkStyles } from "@4x.pro/shared/styles/link";
import type { PropsWithStyles } from "@4x.pro/shared/types";

import { Icon } from "./icon";

type Props = {
  text?: string;
  href?: string;
  iconSrc?: `/icons/${string}.svg`;
  external?: boolean;
  onClick?: () => void;
};

const Link: FC<PropsWithStyles<Props, typeof mkLinkStyles>> = ({
  text,
  href,
  iconSrc,
  external,
  onClick,
  size = "md",
  variant = "accent",
  uppercase = false,
}) => {
  const linkStyles = mkLinkStyles({ size, variant, uppercase });
  const innerSlot = (
    <>
      {iconSrc && <Icon src={iconSrc} className={linkStyles.icon} />}
      {text && <span>{text}</span>}
    </>
  );
  if (!href)
    return (
      <button type="button" className={linkStyles.root} onClick={onClick}>
        {innerSlot}
      </button>
    );

  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={linkStyles.root}
      onClick={onClick}
    >
      {innerSlot}
    </a>
  ) : (
    <NextLink className={linkStyles.root} href={href} onClick={onClick}>
      {innerSlot}
    </NextLink>
  );
};

export { Link };
