import cn from "classnames";

import { mkDialogStyles } from "@4x.pro/shared/styles/dialog";

const mkManagePositionStyles = () => {
  const dialogStyles = mkDialogStyles();
  return {
    root: cn(dialogStyles.root),
    header: cn(dialogStyles.header, "mb-[12px]", "gap-[12px]"),
    tabs: cn("grid", "grid-flow-col", "grid-cols-fr", "mb-[24px]"),
    tab: cn("text-h5"),
    pnl: cn("flex-1"),
    title: dialogStyles.title,
    closeBtn: dialogStyles.closeBtn,
    panel: cn(dialogStyles.panel, "max-w-[555px]"),
    layout: dialogStyles.layout,
    content: dialogStyles.content,
  };
};

export { mkManagePositionStyles };
