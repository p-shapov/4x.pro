import type { PythConnection } from "@pythnetwork/client";

import type {
  Bar,
  IBasicDataFeed,
} from "@public/vendor/charting_library/charting_library";

import { subscribeOnStream, unsubscribeOnStream } from "./streaming";

const API_ENDPOINT = "https://benchmarks.pyth.network/v1/shims/tradingview";
const lastBarsCache = new Map<string, Bar>();

const getDatafeed = (pythConnection: PythConnection): IBasicDataFeed => ({
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
    fetch(`${API_ENDPOINT}/symbols?symbol=${symbolName}`).then((response) => {
      response
        .json()
        .then((symbolInfo) => {
          onSymbolResolvedCallback(symbolInfo);
        })
        .catch(() => {
          onResolveErrorCallback("Cannot resolve symbol");
          return;
        });
    });
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
          console.log("[getBars]: Get error", error);
          onErrorCallback(error);
        });
    });
  },
  subscribeBars: subscribeOnStream(pythConnection, lastBarsCache),
  unsubscribeBars: unsubscribeOnStream(pythConnection),
});

export { getDatafeed };
