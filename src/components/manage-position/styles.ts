import cn from "classnames";

import { mkDialogStyles } from "@4x.pro/shared/styles/dialog";

const mkManagePositionDialogStyles = () => {
  const dialogStyles = mkDialogStyles();
  return {
    root: cn(dialogStyles.root),
    header: cn(dialogStyles.header, "mb-[12px]", "gap-[12px]"),
    tabsList: cn(
      "grid",
      "grid-flow-col",
      "grid-cols-fr",
      "mb-[18px]",
      "px-[20px]",
      "pb-[8px]",
      "gap-[20px]",
      "border-t-[1px]",
      "border-b-[1px]",
      "border-strong",
    ),
    tab: cn("text-h5"),
    pnl: cn("flex-1"),
    title: dialogStyles.title,
    closeBtn: dialogStyles.closeBtn,
    panel: cn(dialogStyles.panel, "max-w-[555px]"),
    layout: dialogStyles.layout,
    content: dialogStyles.content,
  };
};

export { mkManagePositionDialogStyles };
