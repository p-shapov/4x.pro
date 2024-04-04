import cn from "classnames";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import type { IChartingLibraryWidget } from "@public/vendor/charting_library/charting_library";

import type { Token } from "@4x.pro/app-config";
import { getTickerSymbol } from "@4x.pro/app-config";
import { useToken24hrBenchmark } from "@4x.pro/shared/hooks/use-token-24hr-benchbark";
import { useTvChartingLibraryWidget } from "@4x.pro/shared/hooks/use-tv-charting-library-widget";
import type { PropsWithStyles } from "@4x.pro/shared/types";
import {
  formatCurrency_USD,
  formatPercentage,
} from "@4x.pro/shared/utils/number";
import { TokenPrice } from "@4x.pro/ui-kit/token-price";

import { mkTradingViewChartStyles } from "./styles";
import { AssetSelector } from "../asset-selector";
import { useTradeModule } from "../store";

const TRADING_VIEW_ID = "tw-widget-advanced-chart";

type Props = {
  height: number;
  onChange?: (asset: Token) => void;
};

const TradingViewChart = forwardRef<
  IChartingLibraryWidget | null,
  PropsWithStyles<Props, typeof mkTradingViewChartStyles>
>(({ height, layoutIsDragging, onChange }, ref) => {
  const [tvContentWindowLoaded, setTvContentWindowLoaded] = useState(false);
  const tradingViewChartStyles = mkTradingViewChartStyles({ layoutIsDragging });
  const selectedAsset = useTradeModule((state) => state.selectedAsset);
  const tvWidget = useTvChartingLibraryWidget(selectedAsset, {
    container: TRADING_VIEW_ID,
  });
  const { data: benchmark24hr } = useToken24hrBenchmark({
    token: selectedAsset,
  });
  const change24hr = benchmark24hr
    ? (benchmark24hr.change / benchmark24hr.close) * 100
    : undefined;
  useImperativeHandle<
    IChartingLibraryWidget | null,
    IChartingLibraryWidget | null
  >(ref, () => tvWidget, [tvWidget]);
  const handleAssetChange = (asset: Token) => {
    tvWidget?.chart().setSymbol(getTickerSymbol(asset));
    onChange?.(asset);
  };
  useEffect(() => {
    const iframe = document
      .getElementById(TRADING_VIEW_ID)
      ?.querySelector("iframe");
    if (iframe) {
      const handleLoad = () => {
        setTvContentWindowLoaded(true);
      };
      iframe.contentWindow?.addEventListener("load", handleLoad);

      return () => {
        iframe.contentWindow?.removeEventListener("load", handleLoad);
      };
    }
  }, [tvWidget]);
  return (
    <div className={tradingViewChartStyles.root} style={{ height }}>
      <div className={tradingViewChartStyles.header}>
        <AssetSelector onChange={handleAssetChange} />
        <div className={tradingViewChartStyles.headerSeparator} />
        <span className={tradingViewChartStyles.marketPrice}>
          <TokenPrice token={selectedAsset} fractionalDigits={2} watch />
        </span>
        <div className={tradingViewChartStyles.headerSeparator} />
        <span>
          <span className={tradingViewChartStyles.label24h}>24h High: </span>
          <span className={tradingViewChartStyles.price24h}>
            {formatCurrency_USD(benchmark24hr?.high, 2)}
          </span>
        </span>
        <div className={tradingViewChartStyles.headerSeparator} />
        <span>
          <span className={tradingViewChartStyles.label24h}>24h Low: </span>
          <span className={tradingViewChartStyles.price24h}>
            {formatCurrency_USD(benchmark24hr?.low, 2)}
          </span>
        </span>
        <div className={tradingViewChartStyles.headerSeparator} />
        <span>
          <span className={tradingViewChartStyles.label24h}>24h Change: </span>
          <span className={tradingViewChartStyles.change24h}>
            <span
              className={cn({
                [tradingViewChartStyles.change24hNegative]:
                  (change24hr || 0) < 0,
                [tradingViewChartStyles.change24hPositive]:
                  (change24hr || 0) > 0,
              })}
            >
              {(change24hr || 0) > 0 && "+"}
              {(change24hr || 0) < 0 && "-"}
              {formatPercentage(change24hr, 2)}
            </span>
          </span>
        </span>
        <div className={tradingViewChartStyles.headerSeparator} />
        <span>
          <span className={tradingViewChartStyles.label24h}>24h Volume: </span>
          <span className={tradingViewChartStyles.price24h}>$0.00</span>
        </span>
      </div>
      <div
        id={TRADING_VIEW_ID}
        className={cn(tradingViewChartStyles.tradingView, {
          [tradingViewChartStyles.tradingViewVisible]: tvContentWindowLoaded,
          [tradingViewChartStyles.tradingViewHidden]: !tvContentWindowLoaded,
        })}
      ></div>
    </div>
  );
});

export { TradingViewChart };
