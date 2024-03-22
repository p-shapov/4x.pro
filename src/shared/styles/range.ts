import cn from "classnames";

const mkRangeStyles = () => {
  return {
    root: cn("flex", "gap-[0.6rem]", "items-center"),
    input: cn(
      "absolute",
      "z-10",
      "appearance-none",
      "w-full",
      "bg-transparent",
      "border-none",
      "outline-none",
      "cursor-pointer",
    ),
    label: cn("text-h6", "text-content-2", "cursor-pointer"),
    thumb: cn(
      "[&::-webkit-slider-thumb]:appearance-none",
      "[&::-webkit-slider-thumb]:w-[2.8rem]",
      "[&::-webkit-slider-thumb]:h-[2rem]",
      "[&::-webkit-slider-thumb]:bg-transparent",
      "[&::-webkit-slider-thumb]:transition-transform",
      "[&::-webkit-slider-thumb]:border-none",
      "[&::-webkit-slider-thumb]:rounded-[2rem]",
      "[&::-webkit-slider-thumb]:bg-[url('/images/range-thumb.svg')]",
      "[&::-moz-range-thumb]:w-[2.8rem]",
      "[&::-moz-range-thumb]:h-[2rem]",
      "[&::-moz-range-thumb]:bg-content-1",
      "[&::-moz-range-thumb]:transition-transform",
      "[&::-moz-range-thumb]:border-none",
      "[&::-moz-range-thumb]:rounded-[2rem]",
    ),
    inputWrap: cn(
      "relative",
      "z-0",
      "flex",
      "w-full",
      "items-center",
      "h-[0.8rem]",
    ),
    datalist: cn(
      "absolute",
      "left-0",
      "w-full",
      "h-full",
      "flex",
      "gap-[0.2rem]",
    ),
    tick: cn("inline-block", "flex-1", "rounded-[1px]", "transition-color"),
    tickOutOfRange: "bg-strong",
    tickInRange: "bg-accent",
  };
};

export { mkRangeStyles };
