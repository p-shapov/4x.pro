import cn from "classnames";

const mkStopLossFormStyles = () => {
  return {
    root: cn("grid", "gap-[24px]"),
    statsList: cn("grid", "auto-rows-max", "flex-1", "gap-[12px]"),
  };
};

export { mkStopLossFormStyles };
