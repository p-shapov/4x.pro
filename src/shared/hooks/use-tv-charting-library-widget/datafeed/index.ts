import type { PythVerbosePriceCallback } from "@pythnetwork/client/lib/PythConnection";
import { useMemo } from "react";

import type {
  Bar,
  IBasicDataFeed,
} from "@public/vendor/charting_library/charting_library";

import { getNextBarTimeByResolution } from "./utils";
import { usePythConnection } from "../../use-pyth-connection";

const API_ENDPOINT = "https://benchmarks.pyth.network/v1/shims/tradingview";
const lastBarsCache = new Map<string, Bar>();
const listenersCache = new Map<string, PythVerbosePriceCallback>();

const useDataFeed = () => {
  const pythConnection = usePythConnection();

  const datafeed: IBasicDataFeed = useMemo(
    () => ({
      onReady: (callback) => {
        fetch(`${API_ENDPOINT}/config`).then((response) => {
          response.json().then((configurationData) => {
            setTimeout(() => callback(configurationData));
          });
        });
      },
      searchSymbols: (userInput, _, __, onResultReadyCallback) => {
        fetch(`${API_ENDPOINT}/search?query=${userInput}`).then((response) => {
          response.json().then((data) => {
            onResultReadyCallback(data);
          });
        });
      },
      resolveSymbol: (
        symbolName,
        onSymbolResolvedCallback,
        onResolveErrorCallback,
      ) => {
        fetch(`${API_ENDPOINT}/symbols?symbol=${symbolName}`).then(
          (response) => {
            response
              .json()
              .then((symbolInfo) => {
                onSymbolResolvedCallback(symbolInfo);
              })
              .catch(() => {
                onResolveErrorCallback("Cannot resolve symbol");
                return;
              });
          },
        );
      },
      getBars: (
        symbolInfo,
        resolution,
        periodParams,
        onHistoryCallback,
        onErrorCallback,
      ) => {
        const { firstDataRequest } = periodParams;
        fetch(
          `${API_ENDPOINT}/history?symbol=${symbolInfo.ticker}&from=${periodParams.from}&to=${periodParams.to}&resolution=${resolution}`,
        ).then((response) => {
          response
            .json()
            .then((data) => {
              if (data.t.length === 0) {
                onHistoryCallback([], { noData: true });
                return;
              }
              const bars = [];
              for (let i = 0; i < data.t.length; ++i) {
                bars.push({
                  time: data.t[i] * 1000,
                  low: data.l[i],
                  high: data.h[i],
                  open: data.o[i],
                  close: data.c[i],
                });
              }
              if (firstDataRequest && symbolInfo.ticker) {
                lastBarsCache.set(symbolInfo.ticker, {
                  ...bars[bars.length - 1],
                });
              }
              onHistoryCallback(bars, { noData: false });
            })
            .catch((error) => {
              onErrorCallback(error);
            });
        });
      },
      subscribeBars: (
        symbolInfo,
        resolution,
        onRealtimeCallback,
        listenerGuid,
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
            const lastBar = lastBarsCache.get(symbolInfo.ticker);
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

            lastBarsCache.set(symbolInfo.ticker, bar);
            onRealtimeCallback(bar);
          }
        };
        pythConnection.onPriceChangeVerbose(listener);
        listenersCache.set(listenerGuid, listener);
      },
      unsubscribeBars: (listenerGuid) => {
        const listener = listenersCache.get(listenerGuid);
        pythConnection.callbacks = pythConnection.callbacks.filter(
          (callback) => callback !== listener,
        );
        listenersCache.delete(listenerGuid);
      },
    }),
    [pythConnection],
  );
  return datafeed;
};

export { useDataFeed };
