import cn from "classnames";

type PopoverPosition = "left" | "right";

const mkInputStyles = (inline: boolean) =>
  cn(
    "appearance-none",
    "text-content-1",
    "placeholder:text-content-3",
    "outline-none",
    "w-full",
    "text-body-12",
    {
      [cn("bg-strong", "p-[0.4rem]")]: !inline,
    },
  );
const mkInputWrapStyles = (inline?: boolean) => {
  return cn(
    "inline-flex",
    "items-center",
    "border-[1px]",
    "transition-colors",
    "rounded-[0.6rem]",
    {
      [cn("border-none", "bg-transparent")]: inline,
      [cn("border-strong", "bg-strong")]: !inline,
    },
  );
};
const mkPostfixStyles = () => {
  return cn("inline-flex", "text-body-14", "text-content-2");
};
const mkPrefixStyles = () => {
  return cn("inline-flex", "text-body-14", "text-content-2");
};
const mkPopoverStyles = (position: PopoverPosition) => {
  return cn(
    "absolute",
    "z-10",
    "top-[calc(100%+0.4rem)]",
    "w-max",
    "bg-strong",
    "bg-opacity-[0.99]",
    "rounded-[0.6rem]",
    {
      [cn("left-0")]: position === "left",
      [cn("right-0")]: position === "right",
    },
  );
};
const mkOptionsStyles = () => {
  return cn(
    "grid",
    "gap-[0.4rem]",
    "min-w-[calc(100%+0.8rem)]",
    "outline-none",
    "p-[0.4rem]",
    "max-h-[var(--tw-options-max-height)]",
  );
};
const mkOptionStyles = () => {
  return cn(
    "inline-flex",
    "cursor-pointer",
    "transition-colors",
    "gap-[0.4rem]",
    "rounded-[0.7rem]",
    "hover:bg-content-3",
    "p-[0.4rem]",
  );
};
const mkOptionTextStyles = () => {
  return cn("inline-flex", "text-content-1", "text-h6");
};

type Props = {
  inline?: boolean;
  popoverPosition?: PopoverPosition;
};

const mkSelectStyles = ({
  inline = false,
  popoverPosition = "left",
}: Props) => {
  return {
    root: cn("grid", "relative", "gap-[1rem]"),
    input: mkInputStyles(inline),
    inputWrap: mkInputWrapStyles(inline),
    icon: cn("size-[1.6rem]", "bg-content-1"),
    postfix: mkPostfixStyles(),
    prefix: mkPrefixStyles(),
    popover: mkPopoverStyles(popoverPosition),
    options: mkOptionsStyles(),
    option: mkOptionStyles(),
    optionInactive: cn(),
    optionInline: cn(
      "inline-flex",
      "cursor-pointer",
      "transition-colors",
      "gap-[0.4rem]",
      "rounded-[0.7rem]",
    ),
    optionSelected: cn("bg-content-3"),
    optionActive: cn("bg-content-3"),
    optionText: mkOptionTextStyles(),
  };
};

export type { PopoverPosition };
export { mkSelectStyles };
