import cn from "classnames";

import { mkLayoutStyles } from "@4x.pro/shared/styles/layout";

const mkTradeFormStyles = () => {
  return {
    root: cn("grid", "gap-[2rem]"),
  };
};

const mkLeverageStyles = () => {
  return {
    root: cn("grid", "gap-[1.2rem]", "items-center"),
  };
};

const mkSlippageStyles = () => {
  return {
    root: cn(),
  };
};

const mkPositionStyles = () => {
  const layoutStyles = mkLayoutStyles();
  return {
    root: cn("grid", "gap-[1.2rem]"),
    stats: cn(
      layoutStyles.strongSurface,
      "flex",
      "text-body-12",
      "gap-[1.2rem]",
      "px-[1.6rem]",
      "py-[0.8rem]",
    ),
    statsTitle: cn("flex-1", "text-content-2"),
    statsValue: cn("text-content-1"),
    statsDelimiter: cn(
      "inline-block",
      "border-r",
      "h-full",
      "border-content-3",
    ),
  };
};
const mkTriggerPriceStyles = () => {
  return {
    root: cn("flex", "gap-[1.2rem]"),
  };
};

export {
  mkTradeFormStyles,
  mkLeverageStyles,
  mkPositionStyles,
  mkSlippageStyles,
  mkTriggerPriceStyles,
};
