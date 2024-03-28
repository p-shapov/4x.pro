"use client";
import { useEffect, useRef } from "react";

import type { IChartingLibraryWidget } from "@public/vendor/charting_library/charting_library";

import { useTradeForm } from "@4x.pro/components/trade-form";
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
  const { hydrated, selectAsset, selectedAsset } = useTradeModule((state) => ({
    hydrated: state.hydrated,
    selectAsset: state.selectAsset,
    selectedAsset: state.selectedAsset,
  }));
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
  const tradeForm = useTradeForm();
  useEffect(() => {
    const { unsubscribe } = tradeForm.watch((state) => {
      const asset = state.position?.quote?.token;
      if (asset && asset !== selectedAsset) {
        selectAsset(asset);
        tvWidgetRef.current?.chart().setSymbol(getTvSymbol(asset));
      }
    });
    return unsubscribe;
  }, [selectAsset, selectedAsset, tradeForm]);
  const handleAssetChange = (asset: Token) => {
    tvWidgetRef.current?.chart().setSymbol(getTvSymbol(asset));
    const quoteSize = tradeForm.getValues("position.quote.size");
    tradeForm.setValue("position.quote", {
      token: asset,
      size: quoteSize,
    });
  };
  useEffect(() => {
    const asset = tradeForm.getValues("position.quote.token");
    if (hydrated && asset !== selectedAsset) {
      const quoteSize = tradeForm.getValues("position.quote.size");
      tradeForm.setValue("position.quote", {
        token: selectedAsset,
        size: quoteSize,
      });
    }
  }, [hydrated, selectedAsset, tradeForm]);
  return (
    <div className={tradeModuleStyles.root}>
      {hydrated && (
        <>
          <AssetsToolbar onChange={handleAssetChange} />
          <div className={tradeModuleStyles.content} ref={contentRef}>
            <TradingViewChart
              ref={tvWidgetRef}
              height={position}
              layoutIsDragging={isDragging}
              onChange={handleAssetChange}
            />
            <div
              className={tradeModuleStyles.contentSeparator}
              {...separatorProps}
            ></div>
            <Tables />
          </div>
          <Sidebar tradeForm={tradeForm} />
        </>
      )}
    </div>
  );
};

export { TradeModule };
