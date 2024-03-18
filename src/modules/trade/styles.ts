import cn from "classnames";

import { mkLayoutStyles } from "@promo-shock/shared/styles/layout";

const mkTradeModuleStyles = () => {
  const layoutStyles = mkLayoutStyles();
  return {
    root: cn(
      "grid",
      "grid-cols-[1fr_27.5rem]",
      "grid-rows-[1fr_max-content]",
      "gap-[1.2rem]",
      "p-[3.2rem]",
    ),
    tradingView: cn(
      layoutStyles.cardSurface,
      layoutStyles.cardPaddings,
      "col-[1]",
    ),
    tableTabs: cn(layoutStyles.cardSurface, "col-[1]"),
    tableTab: cn(layoutStyles.cardPaddings, "*:px-[0.4rem]"),
    tableTabPanel: cn(layoutStyles.cardPaddings, "h-[250px]", "pb-[0px]"),
    sidebar: cn("grid", "col-[2]", "row-[1/3]", "gap-[inherit]"),
    sidebarTabs: cn(layoutStyles.cardSurface),
    sidebarTab: cn(layoutStyles.cardPaddings),
    sidebarTabPanel: cn(layoutStyles.cardPaddings),
    sidebarStats: cn(layoutStyles.cardSurface, layoutStyles.cardPaddings),
  };
};

export { mkTradeModuleStyles };
