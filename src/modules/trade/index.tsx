"use client";
import { useRef } from "react";

import type { IChartingLibraryWidget } from "@public/vendor/charting_library/charting_library";

import type { Token } from "@4x.pro/configs/dex-platform";
import { getTvSymbol } from "@4x.pro/configs/dex-platform";
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
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);
  const tradeModuleStyles = mkTradeModuleStyles();
  const handleAssetChange = (asset: Token) => {
    tvWidgetRef.current?.chart().setSymbol(getTvSymbol(asset));
  };
  return (
    <div className={tradeModuleStyles.root}>
      {tradeModuleHydrated && (
        <>
          <AssetsToolbar onChange={handleAssetChange} />
          <div className={tradeModuleStyles.content} ref={contentRef}>
            <TradingViewChart
              ref={tvWidgetRef}
              height={position}
              layoutIsDragging={isDragging}
            />
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
