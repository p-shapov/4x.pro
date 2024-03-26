import type { PythConnection } from "@pythnetwork/client";
import type { PythVerbosePriceCallback } from "@pythnetwork/client/lib/PythConnection";

import type {
  Bar,
  LibrarySymbolInfo,
  ResolutionString,
  SubscribeBarsCallback,
} from "@public/vendor/charting_library/charting_library";

import { getNextBarTimeByResolution } from "./utils";

const listenersCache = new Map<string, PythVerbosePriceCallback>();

const subscribeOnStream =
  (pythConnection: PythConnection, lastBarCache: Map<string, Bar>) =>
  (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: SubscribeBarsCallback,
    listenerGuid: string,
  ) => {
    const listener: PythVerbosePriceCallback = (
      {
        accountInfo: {
          data: { product },
        },
      },
      { accountInfo: { data: priceData } },
    ) => {
      if (product.symbol === symbolInfo.ticker && priceData.price) {
        const lastBar = lastBarCache.get(symbolInfo.ticker);
        if (!lastBar) return;
        const tradeTime = Number(priceData.timestamp) * 1000;
        const nextBarTime =
          getNextBarTimeByResolution(resolution, lastBar.time) * 1000;
        const tradePrice = priceData.price;
        let bar: Bar;
        if (tradeTime >= nextBarTime) {
          bar = {
            time: nextBarTime,
            open: tradePrice,
            high: tradePrice,
            low: tradePrice,
            close: tradePrice,
          };
        } else {
          bar = {
            ...lastBar,
            high: Math.max(lastBar.high, tradePrice),
            low: Math.min(lastBar.low, tradePrice),
            close: tradePrice,
          };
        }

        lastBarCache.set(symbolInfo.ticker, bar);
        onRealtimeCallback(bar);
      }
    };
    pythConnection.onPriceChangeVerbose(listener);
    listenersCache.set(listenerGuid, listener);
    if (pythConnection.callbacks.length === 1) {
      pythConnection.start();
    }
  };

const unsubscribeOnStream =
  (pythConnection: PythConnection) => (listenerGuid: string) => {
    if (pythConnection.callbacks.length === 1) {
      pythConnection.stop();
      return;
    } else {
      const listener = listenersCache.get(listenerGuid);
      pythConnection.callbacks = pythConnection.callbacks.filter(
        (callback) => callback !== listener,
      );
      listenersCache.delete(listenerGuid);
    }
  };

export { subscribeOnStream, unsubscribeOnStream };
