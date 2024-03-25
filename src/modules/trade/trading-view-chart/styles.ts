import cn from "classnames";

import { mkLayoutStyles } from "@4x.pro/shared/styles/layout";

type Props = {
  layoutIsDragging: boolean;
};

const mkTradingViewChartStyles = ({ layoutIsDragging }: Props) => {
  const layoutStyles = mkLayoutStyles();
  return {
    root: cn(
      layoutStyles.cardSurface,
      layoutStyles.cardPaddings,
      "grid",
      "grid-rows-[max-content_1fr]",
      "gap-[12px]",
      {
        [cn("transition-[height]", "duration-500", "will-change-[height]")]:
          !layoutIsDragging,
        ["pointer-events-none"]: layoutIsDragging,
      },
    ),
    header: cn(
      "flex",
      "items-center",
      "pb-[12px]",
      "gap-[12px]",
      "border-b-[1px]",
      "border-strong",
    ),
    headerSeparator: cn("w-[1px]", "h-full", "bg-strong"),
    tradingView: cn("h-full", "transition-opacity"),
    tradingViewVisible: cn("opacity-100"),
    tradingViewHidden: cn("opacity-0"),
    marketPrice: cn("text-h5", "text-green"),
    label24h: cn("text-body-12", "text-content-2"),
    price24h: cn("text-h6", "text-content-1"),
    change24h: cn("text-h6"),
    change24hPositive: cn("text-green"),
    change24hNegative: cn("text-red"),
  };
};

export { mkTradingViewChartStyles };
