import cn from "classnames";
import type { FC } from "react";

import type { Formatter } from "@4x.pro/shared/utils/number";
import { formatDefault } from "@4x.pro/shared/utils/number";

import { Icon } from "./icon";

type Props = {
  initial: number;
  final: number;
  formatValue?: Formatter;
};

const Comparison: FC<Props> = ({
  initial,
  final,
  formatValue = formatDefault,
}) => {
  return (
    <span className={cn("flex", "gap-[0.4rem]", "text-inherit")}>
      <span className="text-content-2">{formatValue(initial, 2)}</span>
      <Icon src="/icons/arrow-right.svg" />
      {formatValue(final, 2)}
    </span>
  );
};

export { Comparison };
