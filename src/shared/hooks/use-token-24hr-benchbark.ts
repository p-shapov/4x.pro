import { createQuery } from "react-query-kit";

import type { Coin } from "@4x.pro/app-config";
import { getTickerSymbol } from "@4x.pro/app-config";

import { getNowUnix } from "../utils/time";

const useToken24hrBenchmarkQuery = createQuery({
  queryKey: ["token-benchmark"],
  fetcher: ({ token }: { token: Coin }) => {
    const to = getNowUnix();
    const from = to - 24 * 60 * 60;
    return fetch(
      `https://benchmarks.pyth.network/v1/shims/tradingview/history?symbol=${getTickerSymbol(
        token,
      )}&resolution=1D&from=${from}&to=${to}`,
    )
      .then((res) => res.json())
      .then((data) => ({
        open: data.o[0] as number,
        high: Math.max(...data.h) as number,
        low: Math.min(...data.l) as number,
        close: data.c[data.c.length - 1] as number,
        change: (data.c[data.c.length - 1] - data.o[0]) as number,
      }));
  },
  staleTime: 60 * 1000,
  gcTime: 60 * 1000,
  refetchInterval: 60 * 1000,
});

const useToken24hrBenchmark = ({ token }: { token: Coin }) => {
  return useToken24hrBenchmarkQuery({ variables: { token } });
};

export { useToken24hrBenchmark, useToken24hrBenchmarkQuery };
