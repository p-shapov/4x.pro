import cn from "classnames";

const mkTooltipStyles = () => {
  return {
    root: cn("size-max"),
    button: cn("cursor-pointer", "size-max", "outline-none"),
    icon: cn("size-[1.6rem]", "text-current"),
    message: cn("bg-dialog", "p-[12px]", "rounded-[16px]"),
    arrow: cn("text-dialog"),
  };
};

export { mkTooltipStyles };
