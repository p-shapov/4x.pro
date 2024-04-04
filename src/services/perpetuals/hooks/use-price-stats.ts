import { createQuery } from "react-query-kit";

import type { Token } from "@4x.pro/app-config";

import { fetchAllStats } from "../fetchers/fetch-prices";

const usePriceStatsQuery = createQuery({
  queryKey: ["price-stats"],
  fetcher: () => fetchAllStats(),
  staleTime: 0,
  gcTime: 0,
});

function usePriceStats() {
  return usePriceStatsQuery();
}

function usePriceStat({ token }: { token: Token }) {
  return usePriceStatsQuery({
    select: (stats) => stats[token],
  });
}

export { usePriceStats, usePriceStatsQuery, usePriceStat };
