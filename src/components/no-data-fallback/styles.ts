import cn from "classnames";

const mkNoDataFallbackStyles = () => {
  return {
    root: cn("grid", "gap-[12px]", "justify-items-center"),
    message: cn("flex", "items-center"),
    text: cn("text-content-1", "text-body-14"),
    icon: cn("size-[2rem]", "text-content-2", "mr-[0.8rem]"),
  };
};

export { mkNoDataFallbackStyles };
