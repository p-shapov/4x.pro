import cn from "classnames";

type Variant = "primary" | "accent";

const mkRootFilled = (variant: Variant) =>
  cn({
    "bg-primary": variant === "primary",
    "border-primary": variant === "primary",
    "text-body": variant === "primary",
    "bg-accent": variant === "accent",
    "border-accent": variant === "accent",
    "text-content-1": variant === "accent",
  });

const mkRootOutlined = (variant: Variant) =>
  cn("bg-transparent", "text-content-1", {
    "border-primary": variant === "primary",
    "border-accent": variant === "accent",
  });

type Props = {
  variant: Variant;
  outlined?: boolean;
};

const mkBaseStyles = (variant: Variant, outlined: boolean) => {
  return cn(
    "hover:bg-opacity-50",
    "hover:border-opacity-50",
    "active:bg-opacity-75",
    "active:border-opacity-75",
    "outline-none",
    "rounded-[1.2rem]",
    "transition-colors",
    "border-[1px]",

    {
      [mkRootFilled(variant)]: !outlined,
      [mkRootOutlined(variant)]: outlined,
    },
  );
};

const mkButtonStyles = ({ variant = "primary", outlined = false }: Props) => {
  const baseStyles = mkBaseStyles(variant, outlined);
  return {
    root: cn("text-h5", "px-[1.6rem]", "py-[0.8rem]", baseStyles),
  };
};

const mkIconButtonStyles = ({
  variant = "primary",
  outlined = false,
}: Props) => {
  const baseStyles = mkBaseStyles(variant, outlined);
  return {
    root: cn("size-[3.83rem]", "p-[0.8rem]", baseStyles),
    icon: cn("w-full", "h-full"),
  };
};

export type { Variant };
export { mkButtonStyles, mkIconButtonStyles };
