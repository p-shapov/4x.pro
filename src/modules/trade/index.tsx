"use client";
import { useRef } from "react";

import { useResizableLayout } from "@4x.pro/shared/hooks/use-resizable-layout";

import { AssetsToolbar } from "./assets-toolbar";
import { Sidebar } from "./sidebar";
import { useTradeModule } from "./store";
import { mkTradeModuleStyles } from "./styles";
import { Tables } from "./tables";
import { TradingViewChart } from "./trading-view-chart";

const TradeModule = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const tradeModuleHydrated = useTradeModule((state) => state.hydrated);
  const { position, separatorProps, isDragging } = useResizableLayout(
    "trade-module",
    {
      initial: 500,
      max: 600,
      min: 200,
      axis: "y",
      containerRef: contentRef,
    },
  );
  const tradeModuleStyles = mkTradeModuleStyles();
  return (
    <div className={tradeModuleStyles.root}>
      {tradeModuleHydrated && (
        <>
          <AssetsToolbar />
          <div className={tradeModuleStyles.content} ref={contentRef}>
            <TradingViewChart height={position} layoutIsDragging={isDragging} />
            <div
              className={tradeModuleStyles.contentSeparator}
              {...separatorProps}
            ></div>
            <Tables />
          </div>
          <Sidebar />
        </>
      )}
    </div>
  );
};

export { TradeModule };
