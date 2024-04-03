import { getTokenId, tokenList } from "@4x.pro/app-config";

import type { PriceStats } from "../lib/types";

type FetchedData = {
  [key: string]: {
    usd: number;
    usd_24h_vol: number;
    usd_24h_change: number;
  };
};

const fetchAllStats = () => {
  const stats = fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${tokenList
      .map(getTokenId)
      .join(
        ",",
      )}&vs_currencies=USD&include_24hr_vol=true&include_24hr_change=true`,
  )
    .then((resp) => resp.json())
    .then((data: FetchedData) => {
      const allStats = tokenList.reduce((acc, token) => {
        const tokenData = data[getTokenId(token)];

        acc[token] = {
          change24hr: tokenData!.usd_24h_change,
          currentPrice: tokenData!.usd,
          high24hr: 0,
          low24hr: 0,
        };

        return acc;
      }, {} as PriceStats);

      return allStats;
    })
    .catch(() => {
      const allStats = tokenList.reduce((acc, token) => {
        acc[token] = {
          change24hr: 0,
          currentPrice: 0,
          high24hr: 0,
          low24hr: 0,
        };

        return acc;
      }, {} as PriceStats);
      return allStats;
    });

  return stats;
};

export { fetchAllStats };
