import cn from "classnames";

import { mkLayoutStyles } from "@4x.pro/shared/styles/layout";

const mkTradeModuleStyles = () => {
  const layoutStyles = mkLayoutStyles();
  return {
    root: cn(
      "grid",
      "grid-cols-[1fr_275px]",
      "grid-rows-[1fr]",
      "gap-[12px]",
      "px-[32px]",
      "pt-[32px]",
      "h-[100vh]",
    ),
    header: cn("col-[1/3]", "h-[3.2rem]", "bg-card", "rounded-[3.2rem]"),
    content: cn(
      "col-[1]",
      "gap-[0.6rem]",
      "pb-[3.2rem]",
      "overflow-y-auto",
      "scrollbar-none",
    ),
    contentSeparator: cn("w-full", "h-[12px]", "cursor-row-resize"),
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
    tableTab: cn(layoutStyles.cardPaddings, "*:px-[4px]"),
    tableTabContent: cn(layoutStyles.cardPaddings, "h-full", "min-h-[0]"),
    tableTabPanel: cn("h-full", "pb-[0px]"),
    sidebar: cn(
      "w-[275px]",
      "h-full",
      "grid",
      "pb-[32px]",
      "gap-[inherit]",
      "overflow-y-auto",
      "scrollbar-none",
    ),
    sidebarTabs: cn(layoutStyles.cardSurface),
    sidebarTab: cn(layoutStyles.cardPaddings),
    sidebarTabContent: cn(layoutStyles.cardPaddings),
    sidebarStats: cn(layoutStyles.cardSurface, layoutStyles.cardPaddings),
  };
};

export { mkTradeModuleStyles };
