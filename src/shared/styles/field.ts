import cn from "classnames";

type Size = "sm" | "md";
type PopoverPosition = "left" | "right";

const mkInputStyles = (outlined: boolean, size: Size) =>
  cn(
    "appearance-none",
    "text-content-1",
    "placeholder:text-content-3",
    "flex-1",
    "outline-none",
    "w-full",
    {
      [cn("bg-transparent")]: outlined,
      [cn("bg-strong")]: !outlined,
      [cn("text-body-12", "px-[0.4rem]", "py-[0.4rem]")]: size === "sm",
      [cn("text-body-14", "px-[1.2rem]", "py-[1rem]")]: size === "md",
    },
  );
const mkInputWrapStyles = (outlined: boolean, size: Size) => {
  return cn(
    "inline-flex",
    "items-center",
    "border-[1px]",
    "transition-colors",
    {
      [cn(
        "border-content-3",
        "hover:border-content-2",
        "focus-within:border-content-2",
      )]: outlined,
      [cn("border-strong", "bg-strong")]: !outlined,
      [cn("gap-[0.4rem]", "rounded-[0.6rem]")]: size === "sm",
      [cn("gap-[1.2rem]", "rounded-[1rem]")]: size === "md",
    },
  );
};
const mkPostfixStyles = (size: Size) => {
  return cn("inline-flex", "text-body-14", "text-content-2", {
    [cn("mr-[0.4rem]")]: size === "sm",
    [cn("mr-[1.2rem]")]: size === "md",
  });
};
const mkPrefixStyles = (size: Size) => {
  return cn("inline-flex", "text-body-14", "text-content-2", {
    [cn("ml-[0.4rem]")]: size === "sm",
    [cn("ml-[1.2rem]")]: size === "md",
  });
};
const mkPopoverStyles = (size: Size, position: PopoverPosition) => {
  return cn(
    "absolute",
    "z-10",
    "top-[calc(100%+0.4rem)]",
    "w-max",
    "bg-strong",
    "border-content-3",
    "rounded-[0.6rem]",
    {
      [cn("rounded-[0.6rem]")]: size === "sm",
      [cn("rounded-[1rem]")]: size === "md",
      [cn("left-0")]: position === "left",
      [cn("right-0")]: position === "right",
    },
  );
};
const mkOptionsStyles = (size: Size) => {
  return cn("grid", "gap-[0.4rem]", "min-w-full", "outline-none", {
    [cn("py-[0.4rem]", "max-h-[var(--tw-options-max-height)]")]: size === "sm",
    [cn("py-[1rem]")]: size === "md",
  });
};
const mkOptionStyles = (size: Size) => {
  return cn(
    "inline-flex",
    "cursor-pointer",
    "rounded-[0.3rem]",
    "hover:bg-content-3",
    "transition-colors",
    "border-[1px]",
    {
      [cn("rounded-[0.6rem]", "p-[0.4rem]", "gap-[0.4rem]")]: size === "sm",
    },
  );
};
const mkOptionTextStyles = (size: Size) => {
  return cn("inline-flex", "text-content-1", {
    "text-h6": size === "sm",
  });
};

type Props = {
  size?: Size;
  outlined?: boolean;
  popoverPosition?: PopoverPosition;
};

const mkFieldStyles = ({
  outlined = true,
  size = "md",
  popoverPosition = "left",
}: Props) => {
  return {
    root: cn("grid", "relative"),
    input: mkInputStyles(outlined, size),
    inputWrap: mkInputWrapStyles(outlined, size),
    label: cn("text-h6", "text-content-1"),
    icon: cn("size-[1.6rem]", "bg-content-1"),
    postfix: mkPostfixStyles(size),
    prefix: mkPrefixStyles(size),
    popover: mkPopoverStyles(size, popoverPosition),
    options: mkOptionsStyles(size),
    option: mkOptionStyles(size),
    optionInactive: cn("border-transparent"),
    optionSelected: cn("border-accent"),
    optionActive: cn("bg-content-3"),
    optionText: mkOptionTextStyles(size),
  };
};

export type { Size, PopoverPosition };
export { mkFieldStyles };
