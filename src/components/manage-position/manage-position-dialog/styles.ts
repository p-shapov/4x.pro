import cn from "classnames";

import { mkDialogStyles } from "@4x.pro/shared/styles/dialog";

const mkManagePositionDialogStyles = () => {
  const dialogStyles = mkDialogStyles();
  return {
    root: cn(dialogStyles.root),
    header: cn(dialogStyles.header, "mb-[12px]", "gap-[12px]"),
    pnl: cn("flex-1"),
    title: dialogStyles.title,
    closeBtn: dialogStyles.closeBtn,
    panel: cn(dialogStyles.panel, "max-w-[555px]"),
    layout: dialogStyles.layout,
  };
};

export { mkManagePositionDialogStyles };
