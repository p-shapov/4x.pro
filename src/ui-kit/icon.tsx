import classNames from "classnames";
import { forwardRef } from "react";

import type { PropsWithClassName } from "@4x.pro/shared/types";

type Props = {
  src: `/icons/${string}.svg`;
  size?: number;
  color?: string;
};

const Icon = forwardRef<HTMLSpanElement, PropsWithClassName<Props>>(
  ({ className, src }, ref) => {
    return (
      <span
        ref={ref}
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
  },
);

export { Icon };
