import cn from "classnames";

const mkBadgeStyles = () => {
  return {
    root: cn(
      "inline-flex",
      "w-max",
      "h-max",
      "pt-[0.1rem]",
      "pb-[0.2rem]",
      "px-[0.7rem]",
      "rounded-[6.5rem]",
      "text-body-12",
      "bg-strong",
      "text-primary",
    ),
  };
};

export { mkBadgeStyles };
