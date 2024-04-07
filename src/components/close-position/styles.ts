import cn from "classnames";

import { mkDialogStyles } from "@4x.pro/shared/styles/dialog";

const mkClosePositionStyles = () => {
  const dialogStyles = mkDialogStyles();
  return {
    root: cn(dialogStyles.root),
    header: cn(dialogStyles.header, "justify-between", "mb-[20px]"),
    title: dialogStyles.title,
    closeBtn: dialogStyles.closeBtn,
    panel: cn(dialogStyles.panel, "max-w-[476px]"),
    layout: dialogStyles.layout,
    form: cn("grid", "gap-[24px]", dialogStyles.content),
    stats: cn("grid", "gap-[12px]"),
    separator: cn("h-[1px]", "w-full", "bg-content-3"),
  };
};

export { mkClosePositionStyles };
