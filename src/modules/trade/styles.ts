import cn from "classnames";

const mkTradeModuleStyles = () => {
  return {
    root: cn(
      "grid",
      "grid-cols-[1fr_275px]",
      "grid-rows-[1fr]",
      "gap-[12px]",
      "h-full",
    ),
    content: cn(
      "col-[1]",
      "gap-[6px]",
      "pb-[32px]",
      "overflow-y-auto",
      "scrollbar-none",
    ),
    contentSeparator: cn("w-full", "h-[12px]", "cursor-row-resize"),
  };
};

export { mkTradeModuleStyles };
