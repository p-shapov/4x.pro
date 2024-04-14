import cn from "classnames";

const mkClosePositionStyles = () => {
  return {
    root: cn("grid", "gap-[24px]"),
    stats: cn("grid", "gap-[12px]"),
    separator: cn("h-[1px]", "w-full", "bg-content-3"),
  };
};

export { mkClosePositionStyles };
