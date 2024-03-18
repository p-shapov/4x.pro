import cn from "classnames";

import { mkLayoutStyles } from "@4x.pro/shared/styles/layout";

const mkTradeModuleStyles = () => {
  const layoutStyles = mkLayoutStyles();
  return {
    root: cn(
      "grid",
      "grid-cols-[1fr_27.5rem]",
      "grid-rows-[1fr]",
      "gap-[1.2rem]",
      "px-[3.2rem]",
      "h-[100vh]",
    ),
    content: cn(
      "col-[1]",
      "gap-[0.6rem]",
      "overflow-y-auto",
      "scrollbar-none",
      "py-[3.2rem]",
    ),
    contentSeparator: cn("w-full", "h-[1.2rem]", "cursor-row-resize"),
    tradingView: cn(
      layoutStyles.cardSurface,
      layoutStyles.cardPaddings,
      "h-[var(--tw-trading-view-height,500px)]",
    ),
    tableTabs: cn(
      layoutStyles.cardSurface,
      "min-h-[200px]",
      "h-[calc(100%-var(--tw-trading-view-height,500px))]",
    ),
    tableTab: cn(layoutStyles.cardPaddings, "*:px-[0.4rem]"),
    tableTabPanel: cn(layoutStyles.cardPaddings, "h-full", "pb-[0px]"),
    sidebar: cn(
      "sticky",
      "top-[3.2rem]",
      "w-[27.5rem]",
      "h-full",
      "grid",
      "gap-[inherit]",
      "overflow-y-auto",
      "scrollbar-none",
      "py-[3.2rem]",
    ),
    sidebarTabs: cn(layoutStyles.cardSurface),
    sidebarTab: cn(layoutStyles.cardPaddings),
    sidebarTabPanel: cn(layoutStyles.cardPaddings),
    sidebarStats: cn(layoutStyles.cardSurface, layoutStyles.cardPaddings),
  };
};

export { mkTradeModuleStyles };
