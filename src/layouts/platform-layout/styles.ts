import cn from "classnames";

const mkPlatformLayoutStyles = () => {
  return {
    overlay: cn(
      "w-full",
      "h-100vh",
      "bg-[url('/images/app-bg.png')]",
      "bg-cover",
    ),
    root: cn(
      "relative",
      "grid",
      "gap-[4px]",
      "px-[16px]",
      "w-100%",
      "max-w-[1440px]",
      "m-auto",
      "h-[100vh]",
      "grid-rows-[max-content_1fr]",
    ),
    header: cn(
      "grid",
      "grid-flow-col",
      "justify-between",
      "justify-items-center",
      "items-center",
      "py-[20px]",
    ),
    logo: cn("absolute"),
    main: cn("h-full", "min-h-[0px]"),
    controls: cn("flex", "gap-[12px]"),
  };
};

export { mkPlatformLayoutStyles };
