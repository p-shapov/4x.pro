import cn from "classnames";

const mkInputStyles = () =>
  cn(
    "appearance-none",
    "text-content-1",
    "placeholder:text-content-3",
    "outline-none",
    "w-full",
    "text-body-14",
    "px-[1.2rem]",
    "py-[1rem]",
    "bg-transparent",
  );
const mkInputWrapStyles = (error: boolean) => {
  return cn(
    "inline-flex",
    "items-center",
    "border-[1px]",
    "transition-colors",
    "rounded-[1rem]",
    "border-content-3",
    "hover:border-content-2",
    "focus-within:border-content-2",
    {
      [cn("border-red", "hover:border-red", "focus-within:border-red")]: error,
    },
  );
};
const mkPostfixStyles = () => {
  return cn("inline-flex", "text-body-14", "text-content-2", "mr-[1.2rem]");
};
const mkPrefixStyles = () => {
  return cn("inline-flex", "text-body-14", "text-content-2", "ml-[1.2rem]");
};

type Props = {
  error?: boolean;
};

const mkFieldStyles = ({ error = false }: Props) => {
  return {
    root: cn("grid", "relative", "gap-[1rem]"),
    input: mkInputStyles(),
    inputWrap: mkInputWrapStyles(error),
    label: cn("text-h6", "text-content-1", "transition-colors", {
      [cn("text-red")]: error,
    }),
    icon: cn("size-[1.6rem]", "bg-content-1"),
    postfix: mkPostfixStyles(),
    prefix: mkPrefixStyles(),
  };
};

export { mkFieldStyles };
