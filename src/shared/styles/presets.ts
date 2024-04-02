import cn from "classnames";

const mkPresetsStyles = () => {
  return {
    root: cn("flex", "gap-[0.4rem]"),
    option: cn(
      "inline-flex",
      "w-max",
      "h-max",
      "pt-[0.2rem]",
      "pb-[0.3rem]",
      "px-[0.4rem]",
      "rounded-[0.7rem]",
      "text-h6",
      "bg-strong",
      "text-accent",
      "cursor-pointer",
    ),
  };
};

export { mkPresetsStyles };
