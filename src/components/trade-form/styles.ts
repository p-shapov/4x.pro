import cn from "classnames";

import { mkFieldStyles } from "@promo-shock/shared/styles/field";
import { mkLayoutStyles } from "@promo-shock/shared/styles/layout";

const mkTradeFormStyles = () => {
  return {
    root: cn("grid", "gap-[2rem]"),
  };
};

const mkLeverageStyles = () => {
  const fieldStyles = mkFieldStyles({});
  return {
    root: cn(
      "grid",
      "gap-[1rem_1.2rem]",
      "grid-cols-[max-content_max-content]",
      "items-center",
    ),
    label: cn(fieldStyles.label, "col-span-2"),
    range: cn("col-span-2"),
  };
};

const mkSlippageStyles = () => {
  const fieldStyles = mkFieldStyles({});
  return {
    root: cn(
      "grid",
      "gap-[1rem_1.2rem]",
      "grid-cols-[max-content_max-content]",
      "items-center",
    ),
    field: cn("min-w-[96px]"),
    label: cn(fieldStyles.label, "col-span-2"),
  };
};

const mkPositionStyles = () => {
  const layoutStyles = mkLayoutStyles();
  return {
    root: cn("grid", "gap-[1.2rem]"),
    stats: cn(
      layoutStyles.strongSurface,
      "flex",
      "gap-[1.2rem]",
      "px-[1.6rem]",
      "py-[0.8rem]",
    ),
    statsItem: cn("flex-1", "text-body-12", "text-content-2"),
    statsValue: cn("text-content-1"),
    statsDelimiter: cn(
      "inline-block",
      "border-r",
      "h-full",
      "border-content-3",
    ),
  };
};
const mkClosingOptionsStyles = () => {
  return {
    root: cn("flex", "gap-[1.2rem]"),
  };
};

export {
  mkTradeFormStyles,
  mkLeverageStyles,
  mkPositionStyles,
  mkSlippageStyles,
  mkClosingOptionsStyles,
};
