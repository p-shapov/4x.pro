import cn from "classnames";

type Variant = "primary" | "accent" | "red";

const mkRootFilled = (variant: Variant, disabled: boolean) =>
  cn({
    [cn("bg-primary", "border-primary", "text-body")]:
      variant === "primary" && !disabled,
    [cn("bg-accent", "border-accent", "text-content-1")]:
      variant === "accent" && !disabled,
    [cn("bg-red", "border-red", "text-content-1")]:
      variant === "red" && !disabled,
    [cn("bg-content-3", "text-content-2", "border-content-3")]: disabled,
  });

const mkRootOutlined = (variant: Variant, disabled: boolean) =>
  cn("bg-transparent", "text-content-1", {
    [cn("border-primary")]: variant === "primary" && !disabled,
    [cn("border-accent")]: variant === "accent" && !disabled,
    [cn("border-red")]: variant === "red" && !disabled,
    [cn("border-content-3", "text-content-2")]: disabled,
  });

type Props = {
  variant: Variant;
  outlined?: boolean;
  size?: "md" | "lg";
  disabled?: boolean;
};

const mkBaseStyles = (
  variant: Variant,
  outlined: boolean,
  disabled: boolean,
) => {
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
      [mkRootFilled(variant, disabled)]: !outlined,
      [mkRootOutlined(variant, disabled)]: outlined,
      "cursor-pointer": !disabled,
      "cursor-not-allowed": disabled,
    },
  );
};

const mkButtonStyles = ({
  variant = "primary",
  outlined = false,
  fill = true,
  size = "md",
  disabled = false,
}: Props & { fill?: boolean }) => {
  const baseStyles = mkBaseStyles(variant, outlined, disabled);
  return {
    root: cn(baseStyles, {
      "w-full": fill,
      [cn("px-[1.6rem]", "py-[0.8rem]", "text-h5")]: size === "md",
      [cn(
        "px-[2.4rem]",
        "py-[1.2rem]",
        "text-[1.6rem]",
        "font-bold",
        "leading-loose",
      )]: size === "lg",
    }),
  };
};

const mkIconButtonStyles = ({
  variant = "primary",
  outlined = false,
  size = "md",
  disabled = false,
}: Props) => {
  const baseStyles = mkBaseStyles(variant, outlined, disabled);
  return {
    root: cn(baseStyles, {
      [cn("size-[3.83rem]", "p-[0.8rem]")]: size === "md",
      [cn("size-[4.8rem]", "p-[1.2rem]")]: size === "lg",
    }),
    icon: cn("w-full", "h-full"),
  };
};

export type { Variant };
export { mkButtonStyles, mkIconButtonStyles };
