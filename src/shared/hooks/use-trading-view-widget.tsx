/* eslint-disable import/no-unresolved */
import { useEffect, useState } from "react";

import { tokenConfig } from "@4x.pro/configs/token-config";
import type { Token } from "@4x.pro/configs/token-config";

declare global {
  interface Window {
    TradingView: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      widget: { new (config: any): any };
    };
  }
}

type Config = {
  container_id: string;
  interval: string;
};

const initTradingViewWidget = async (
  token: Token,
  { container_id, interval }: Config,
) => {
  // @ts-expect-error - external script
  await import(/* webpackIgnore: true */ "https://s3.tradingview.com/tv.js");
  return (
    "TradingView" in window &&
    new window.TradingView.widget({
      container_id,
      interval,
      autosize: true,
      timezone: "Etc/UTC",
      locale: "en",
      symbol: tokenConfig.TradingViewSymbols[token],
      disabled_features: ["header_settings", "header_symbol_search"],
      client_id: "tradingview.com",
      user_id: "public_user_id",
      enable_publishing: false,
      allow_symbol_change: true,
      theme: "dark",
      style: "1",
      toolbar_bg: "rgba(29, 31, 35, 0.8)",
      backgroundColor: "rgba(29, 31, 35, 0.8)",
    })
  );
};

const useTradingViewWidget = (
  token: Token | undefined,
  { container_id, interval }: Config,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [widgetInstance, setWidgetInstance] = useState<any>(null);

  useEffect(() => {
    let cancel = false;
    const initWidget = async () => {
      if (token) {
        const widget = await initTradingViewWidget(token, {
          container_id,
          interval,
        });
        if (!cancel) setWidgetInstance(widget);
      }
    };
    initWidget();

    return () => {
      cancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, interval, container_id]);

  return widgetInstance;
};

export { useTradingViewWidget };
