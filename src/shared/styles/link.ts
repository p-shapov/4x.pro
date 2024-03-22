import cn from "classnames";

type Size = "md" | "lg";
type Variant = "accent" | "red" | "grey";

type Props = {
  size?: Size;
  variant?: Variant;
  uppercase?: boolean;
};

const mkLinkStyles = ({
  size = "md",
  variant = "accent",
  uppercase = false,
}: Props) => {
  return {
    root: cn(
      "inline-flex",
      "gap-[0.4rem]",
      "items-center",
      "group",
      "transition-colors",
      "hover:text-opacity-50",
      "active:text-opacity-70",
      {
        "text-h6": size === "md",
        "text-h3": size === "lg",
        "text-accent": variant === "accent",
        "text-red": variant === "red",
        "text-content-2": variant === "grey",
        uppercase: uppercase,
      },
    ),
    icon: cn({
      "size-[1.6rem]": size === "md",
      "size-[2.4rem]": size === "lg",
    }),
  };
};

export { mkLinkStyles };
