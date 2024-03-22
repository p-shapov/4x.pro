import cn from "classnames";

const mkButtonLinkStyles = () => {
  return {
    root: cn(
      "relative",
      "z-0",
      "flex",
      "justify-center",
      "items-center",
      "py-[1.9rem]",
      "bg-white",
      "bg-opacity-[0.15]",
      "border-[1px]",
      "border-white",
      "border-opacity-[0.25]",
      "rounded-[2.4rem]",
      "transition-colors",
      "hover:bg-opacity-[0.25]",
      "hover:border-opacity-[1]",
    ),
    icon: cn("absolute", "left-[2.4rem]", "text-white", "size-[3.2rem]"),
    text: cn(
      "font-[family-name:var(--unbounded-text-font)]",
      "text-[1.6rem]",
      "font-[200]",
      "leading-[1.6]",
      "text-white",
    ),
  };
};

export { mkButtonLinkStyles };
