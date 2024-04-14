import cn from "classnames";

import { mkLayoutStyles } from "@4x.pro/shared/styles/layout";

const mkLiquidityTabsStyles = () => {
  const layoutStyles = mkLayoutStyles();
  return {
    root: cn(layoutStyles.cardSurface, "w-full", "max-w-[400px]"),
    tabsList: cn("px-[20px]"),
    tab: cn(layoutStyles.cardPaddings),
    content: cn(layoutStyles.cardPaddings),
  };
};

export { mkLiquidityTabsStyles };
