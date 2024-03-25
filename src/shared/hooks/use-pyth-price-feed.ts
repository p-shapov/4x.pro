import type { PriceData, Product } from "@pythnetwork/client";
import { useSyncExternalStore } from "react";

import { useDexPlatformConfig } from "@4x.pro/configs/dex-platform";
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

const useWatchPythPriceFeed = (token: Token): PriceFeed => {
  const pythConnection = useDexPlatformConfig((state) => state.pythConnection);

  return useSyncExternalStore<PriceFeed>(
    (listener) => {
      if (listeners.size === 0) {
        pythConnection?.start();
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
        if (listeners.size === 0) {
          pythConnection?.stop();
        }
      };
    },
    () => PriceFeeds[token],
    () => ({}),
  );
};

export { useWatchPythPriceFeed };
