import cn from "classnames";

import { mkLayoutStyles } from "@4x.pro/shared/styles/layout";

const mkSidebarStyles = () => {
  const layoutStyles = mkLayoutStyles();
  return {
    root: cn(
      "w-[275px]",
      "h-full",
      "grid",
      "pb-[32px]",
      "gap-[inherit]",
      "overflow-auto",
      "scrollbar-none",
    ),
    tabs: cn(layoutStyles.cardSurface),
    tab: cn("px-[20px]"),
    tabContent: cn(layoutStyles.cardPaddings),
    tabsList: cn("px-[20px]", "gap-[20px]"),
    stats: cn(layoutStyles.cardSurface, layoutStyles.cardPaddings),
  };
};

export { mkSidebarStyles };
