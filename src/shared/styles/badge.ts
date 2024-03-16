import cn from "classnames";

const mkBadgeStyles = () => {
  return {
    root: cn(
      "w-max",
      "pt-[0.4rem]",
      "pb-[0.5rem]",
      "px-[0.8rem]",
      "rounded-[2.4rem]",
      "text-h6",
      "bg-accent",
      "bg-opacity-[0.13]",
      "text-accent",
    ),
  };
};

export { mkBadgeStyles };
