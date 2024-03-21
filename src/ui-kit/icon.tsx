import classNames from "classnames";
import type { FC } from "react";

import type { PropsWithClassName } from "@4x.pro/shared/types";

type Props = {
  src: `/icons/${string}.svg`;
  size?: number;
  color?: string;
};

const Icon: FC<PropsWithClassName<Props>> = ({ className, src }) => {
  return (
    <span
      className={classNames(
        "inline-flex",
        "mask-[var(--tw-icon-src)]",
        "mask-size-cover",
        "bg-[currentColor]",
        className,
      )}
      style={{
        // @ts-expect-error - CSS variable
        "--tw-icon-src": `url('${src}')`,
      }}
    />
  );
};

export { Icon };
