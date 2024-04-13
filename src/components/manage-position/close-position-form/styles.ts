import cn from "classnames";

import { mkDialogStyles } from "@4x.pro/shared/styles/dialog";

const mkClosePositionStyles = () => {
  const dialogStyles = mkDialogStyles();
  return {
    root: cn("grid", "gap-[24px]", dialogStyles.content),
    stats: cn("grid", "gap-[12px]"),
    separator: cn("h-[1px]", "w-full", "bg-content-3"),
  };
};

export { mkClosePositionStyles };
