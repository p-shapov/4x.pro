import cn from "classnames";

import { mkLayoutStyles } from "./layout";

const mkDialogStyles = () => {
  const layoutStyles = mkLayoutStyles();
  return {
    root: cn(
      "fixed",
      "z-[1000]",
      "inset-0",
      "w-full",
      "h-full",
      "overflow-auto",
      "bg-backdrop",
      "bg-opacity-[0.91]",
    ),
    layout: cn("flex", "min-h-full", "items-center", "justify-center"),
    panel: cn(
      layoutStyles.dialogSurface,
      "relative",
      "z-[1]",
      "w-full",
      "py-[20px]",
    ),
    content: cn("px-[20px]"),
    header: cn("flex", "items-center", "px-[20px]"),
    closeBtn: cn(
      "cursor-pointer",
      "text-content-1",
      "size-[2rem]",
      "hover:text-opacity-[0.5]",
      "transition-colors",
    ),
    title: cn("text-h2", "text-content-1"),
  };
};

export { mkDialogStyles };
