"use client";
import { useEffect, useRef } from "react";

import type { IChartingLibraryWidget } from "@public/vendor/charting_library/charting_library";

import type { Token } from "@4x.pro/app-config";
import { getTickerSymbol } from "@4x.pro/app-config";
import { useOpenPositionForm } from "@4x.pro/components/manage-position";
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
  const openPositionForm = useOpenPositionForm();
  useEffect(() => {
    const { unsubscribe } = openPositionForm.watch((state) => {
      const asset = state.position?.quote?.token;
      if (asset && asset !== selectedAsset) {
        selectAsset(asset);
        tvWidgetRef.current?.chart().setSymbol(getTickerSymbol(asset));
      }
    });
    return unsubscribe;
  }, [selectAsset, selectedAsset, openPositionForm]);
  const handleAssetChange = (asset: Token) => {
    tvWidgetRef.current?.chart().setSymbol(getTickerSymbol(asset));
    const quoteSize = openPositionForm.getValues("position.quote.size");
    openPositionForm.setValue("position.quote", {
      token: asset,
      size: quoteSize,
    });
  };
  useEffect(() => {
    const asset = openPositionForm.getValues("position.quote.token");
    if (hydrated && asset !== selectedAsset) {
      const quoteSize = openPositionForm.getValues("position.quote.size");
      openPositionForm.setValue("position.quote", {
        token: selectedAsset,
        size: quoteSize,
      });
    }
  }, [hydrated, selectedAsset, openPositionForm]);
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
          <Sidebar openPositionForm={openPositionForm} />
        </>
      )}
    </div>
  );
};

export { TradeModule };
