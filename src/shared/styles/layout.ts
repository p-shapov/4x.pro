import cn from "classnames";

const mkLayoutStyles = () => {
  return {
    cardSurface: cn(
      "bg-card",
      "bg-opacity-80",
      "rounded-[1.6rem]",
      "border-[1px]",
      "border-white",
      "border-opacity-[0.03]",
    ),
    cardPaddings: cn("p-[1.2rem]"),
    strongSurface: cn(
      "bg-strong",
      "rounded-[1.6rem]",
      "px-[1.5rem]",
      "py-[0.8rem]",
    ),
  };
};

export { mkLayoutStyles };
