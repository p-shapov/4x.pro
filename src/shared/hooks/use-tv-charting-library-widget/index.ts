import { useVisibilityChange } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

import type {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
} from "@public/vendor/charting_library/charting_library";

import type { Token } from "@4x.pro/app-config";
import { getTickerSymbol } from "@4x.pro/app-config";

import { useDataFeed } from "./datafeed";

const useTvChartingLibraryWidget = (
  token: Token,
  config: Partial<ChartingLibraryWidgetOptions>,
) => {
  const datafeed = useDataFeed();
  const [tvChartingLibraryWidget, setTvChartingLibraryWidget] =
    useState<IChartingLibraryWidget | null>(null);

  const visible = useVisibilityChange();

  useEffect(() => {
    if (visible && tvChartingLibraryWidget) {
      tvChartingLibraryWidget.onChartReady(() => {
        tvChartingLibraryWidget.chart().resetData();
      });
    }
  }, [tvChartingLibraryWidget, visible]);

  useEffect(() => {
    const loadTvChartingLibraryWidget = async () => {
      try {
        await import("@public/vendor/charting_library/charting_library");
      } catch {
        return null;
      }
      if (!window.TradingView) return null;
      const instance = new window.TradingView.widget({
        container: "tv-charting-library-widget",
        autosize: true,
        timezone: "Etc/UTC",
        locale: "en",
        interval: "1" as ResolutionString,
        datafeed: datafeed,
        symbol: getTickerSymbol(token),
        overrides: {
          "paneProperties.background": "#151719",
          "paneProperties.backgroundType": "solid",
        },
        toolbar_bg: "transparent",
        disabled_features: [
          "header_settings",
          "header_symbol_search",
          "timeframes_toolbar",
          "timezone_menu",
          "header_compare",
          "header_undo_redo",
          "header_quick_search",
          "header_fullscreen_button",
          "header_screenshot",
          "use_localstorage_for_settings",
        ],
        loading_screen: {
          backgroundColor: "transparent",
          foregroundColor: "var(--color-primary)",
        },
        enabled_features: ["header_saveload"],
        client_id: "tradingview.com",
        user_id: "public_user_id",
        library_path: "/vendor/charting_library/",
        custom_css_url: "/css/trading-view.css",
        theme: "dark",
        ...config,
      });
      setTvChartingLibraryWidget(instance);
    };
    loadTvChartingLibraryWidget();
    return () => {
      tvChartingLibraryWidget?.remove();
      setTvChartingLibraryWidget(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datafeed]);

  return tvChartingLibraryWidget;
};

export { useTvChartingLibraryWidget };
