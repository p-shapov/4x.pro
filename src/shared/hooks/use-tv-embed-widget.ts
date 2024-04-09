/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";

import type {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
} from "@public/vendor/charting_library/charting_library";

import { getPythTickerSymbol } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";

const useTvEmbedWidget = (
  token: Token,
  config: Omit<Partial<ChartingLibraryWidgetOptions>, "container"> & {
    container_id?: string;
  },
) => {
  const [tvChartingLibraryWidget, setTvChartingLibraryWidget] =
    useState<IChartingLibraryWidget | null>(null);

  useEffect(() => {
    const loadTvEmbedWidget = async () => {
      try {
        await import(
          // @ts-ignore
          /* webpackIgnore: true */ "https://s3.tradingview.com/tv.js"
        );
      } catch {
        return null;
      }
      if (!window.TradingView) return null;
      // @ts-ignore
      const instance = new window.TradingView.widget({
        container_id: "tv-charting-library-widget",
        autosize: true,
        timezone: "Etc/UTC",
        locale: "en",
        interval: "1" as ResolutionString,
        symbol: getPythTickerSymbol(token),
        client_id: "tradingview.com",
        user_id: "public_user_id",
        // @ts-ignore
        enable_publishing: false,
        allow_symbol_change: true,
        theme: "dark",
        style: "1",
        ...config,
      });
      setTvChartingLibraryWidget(instance);
    };
    loadTvEmbedWidget();
    return () => {
      setTvChartingLibraryWidget(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return tvChartingLibraryWidget;
};

export { useTvEmbedWidget };
