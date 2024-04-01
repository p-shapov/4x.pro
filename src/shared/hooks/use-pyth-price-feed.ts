import type {
  PythHttpClient,
  PriceData,
  Product,
  PythConnection,
} from "@pythnetwork/client";
import { PublicKey } from "@solana/web3.js";
import { useSyncExternalStore } from "react";
import { createQuery } from "react-query-kit";

import { getTokenPythFeedId_to_USD } from "@4x.pro/configs/dex-platform";
import type { Token } from "@4x.pro/configs/dex-platform";

type PriceFeed = {
  product?: Product;
  priceData?: PriceData;
};

const PriceFeeds: Record<Token, PriceFeed> = {
  BTC: {},
  SOL: {},
  ETH: {},
  USDC: {},
};

const TokenMap: Record<string, Token> = {
  BTC: "BTC",
  SOL: "SOL",
  ETH: "ETH",
  USDC: "USDC",
};
const listeners = new Set<() => void>();
const emit = () => {
  listeners.forEach((listener) => listener());
};

const useWatchPythPriceFeed =
  (pythConnection: PythConnection | null) =>
  (token: Token): PriceFeed => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSyncExternalStore<PriceFeed>(
      (listener) => {
        if (listeners.size === 0) {
          pythConnection?.onPriceChange((product, priceData) => {
            const token = TokenMap[product.base];
            if (!token) return;
            PriceFeeds[token] = { product, priceData };
            emit();
          });
        }
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
      () => PriceFeeds[token],
      () => ({}),
    );
  };

const usePythPriceFeed = (pythHttpClient: PythHttpClient | null) =>
  createQuery({
    queryKey: ["pyth-price-feed"],
    fetcher: async ({ token }: { token: Token }) => {
      if (!pythHttpClient) return null;
      const [priceData] = await pythHttpClient.getAssetPricesFromAccounts([
        new PublicKey(getTokenPythFeedId_to_USD(token)),
      ]);
      return priceData;
    },
  });

export { useWatchPythPriceFeed, usePythPriceFeed };
