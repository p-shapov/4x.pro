import cn from "classnames";

import { mkLayoutStyles } from "@4x.pro/shared/styles/layout";

const mkTablesStyles = () => {
  const layoutStyles = mkLayoutStyles();
  return {
    root: cn(layoutStyles.cardSurface),
    tab: cn(layoutStyles.cardPaddings, "*:px-[4px]"),
    tabContent: cn(layoutStyles.cardPaddings, "h-full", "min-h-[200px]"),
    tabPanel: cn("h-full", "pb-[0px]"),
  };
};

export { mkTablesStyles };
