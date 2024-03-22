import type { FC } from "react";

import { useTradingViewWidget } from "@4x.pro/shared/hooks/use-trading-view-widget";
import type { PropsWithStyles } from "@4x.pro/shared/types";
import { TokenPrice } from "@4x.pro/ui-kit/token-price";

import { mkTradingViewChartStyles } from "./styles";
import { AssetSelector } from "../asset-selector";
import { useTradeModule } from "../store";

const TRADING_VIEW_ID = "tw-embed-widget-advanced-chart";

type Props = {
  height: number;
};

const TradingViewChart: FC<
  PropsWithStyles<Props, typeof mkTradingViewChartStyles>
> = ({ height, layoutIsDragging }) => {
  const tradingViewChartStyles = mkTradingViewChartStyles({ layoutIsDragging });
  const selectedAsset = useTradeModule((state) => state.selectedAsset);
  useTradingViewWidget(selectedAsset, {
    container_id: TRADING_VIEW_ID,
    interval: "1",
  });
  return (
    <div className={tradingViewChartStyles.root} style={{ height }}>
      <div className={tradingViewChartStyles.header}>
        <AssetSelector />
        <div className={tradingViewChartStyles.headerSeparator} />
        <span className={tradingViewChartStyles.marketPrice}>
          <TokenPrice token={selectedAsset} />
        </span>
        <div className={tradingViewChartStyles.headerSeparator} />
        <span>
          <span className={tradingViewChartStyles.label24h}>24h High: </span>
          <span className={tradingViewChartStyles.price24h}>$0.00</span>
        </span>
        <div className={tradingViewChartStyles.headerSeparator} />
        <span>
          <span className={tradingViewChartStyles.label24h}>24h Low: </span>
          <span className={tradingViewChartStyles.price24h}>$0.00</span>
        </span>
        <div className={tradingViewChartStyles.headerSeparator} />
        <span>
          <span className={tradingViewChartStyles.label24h}>24h Change: </span>
          <span className={tradingViewChartStyles.change24h}>
            <span className={tradingViewChartStyles.change24hPositive}>
              +0.00%
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
        className={tradingViewChartStyles.tradingView}
      ></div>
    </div>
  );
};

export { TradingViewChart };
