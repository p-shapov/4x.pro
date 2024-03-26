import cn from "classnames";

const mkLayoutStyles = () => {
  return {
    cardSurface: cn(
      "bg-card",
      "bg-opacity-80",
      "rounded-[16px]",
      "border-[1px]",
      "border-white",
      "border-opacity-[0.03]",
    ),
    cardPaddings: cn("p-[12px]"),
    strongSurface: cn("bg-strong", "rounded-[16px]"),
    dialogSurface: cn(
      "bg-dialog",
      "bg-opacity-[0.99]",
      "rounded-[16px]",
      "border-[1px]",
      "border-white",
      "border-opacity-[0.03]",
    ),
  };
};

export { mkLayoutStyles };
