import cn from "classnames";

import { mkLayoutStyles } from "@4x.pro/shared/styles/layout";

const mkTokenDistributionStyles = () => {
  const layoutStyles = mkLayoutStyles();
  return {
    root: cn(
      "grid",
      layoutStyles.cardSurface,
      layoutStyles.cardPaddings,
      "gap-[12px]",
      "grid-rows-[max-content_1fr]",
    ),
    title: cn("text-h3", "text-content-1", "pl-[24px]", "uppercase"),
  };
};

export { mkTokenDistributionStyles };
