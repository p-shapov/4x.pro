import cn from "classnames";

const mkInputStyles = () =>
  cn(
    "col-[1]",
    "row-[1]",
    "min-w-[1rem]",
    "w-auto",
    "text-content-1",
    "text-body-14",
    "py-[1rem]",
    "appearance-none",
    "bg-transparent",
    "outline-none",
  );
const mkInputWrapStyles = (error: boolean) => {
  return cn(
    "inline-flex",
    "justify-between",
    "items-center",
    "border-[1px]",
    "transition-colors",
    "rounded-[1rem]",
    "border-content-3",
    "hover:border-content-2",
    "focus-within:border-content-2",
    "px-[1.2rem]",
    "pr-[0.5rem]",
    "gap-[1.2rem]",
    {
      [cn("border-red", "hover:border-red", "focus-within:border-red")]: error,
    },
  );
};
const mkPostfixStyles = (notEmpty: boolean) => {
  return cn("inline-flex", "text-body-14", {
    ["text-content-1"]: notEmpty,
    ["text-content-2"]: !notEmpty,
  });
};
const mkPrefixStyles = (notEmpty: boolean) => {
  return cn("inline-flex", "text-body-14", {
    ["text-content-1"]: notEmpty,
    ["text-content-2"]: !notEmpty,
  });
};

type Props = {
  error?: boolean;
  notEmpty?: boolean;
};

const mkFieldStyles = ({ error = false, notEmpty = false }: Props) => {
  return {
    root: cn("grid", "relative", "gap-[1rem]", "w-full"),
    input: mkInputStyles(),
    inputWrap: mkInputWrapStyles(error),
    fieldWrap: cn("relative", "inline-grid", "items-center", "grid-flow-col"),
    fakeInput: cn(
      "col-[1]",
      "row-[1]",
      "min-w-[1rem]",
      "w-auto",
      "text-content-1",
      "text-body-14",
      "invisible",
      "pr-[0.5rem]",
      {
        ["text-content-3"]: !notEmpty,
        ["text-content-1"]: notEmpty,
      },
    ),
    label: cn("text-h6", "text-content-1", "transition-colors", {
      [cn("text-red")]: error,
    }),
    icon: cn("size-[1.6rem]", "bg-content-1"),
    postfix: mkPostfixStyles(notEmpty),
    prefix: mkPrefixStyles(notEmpty),
    labelTooltip: cn("size-max", "text-content-2", "ml-[10px]"),
  };
};

export { mkFieldStyles };
