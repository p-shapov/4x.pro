import type { PriceData, Product } from "@pythnetwork/client";
import { useSyncExternalStore } from "react";

import { pythConnection } from "@4x.pro/configs/pyth-network-client";
import type { Token } from "@4x.pro/configs/token-config";

type PriceFeed = {
  product?: Product;
  priceData?: PriceData;
};

const TokenPriceFeed: Record<Token, PriceFeed> = {
  Sol_BTC: {},
  Sol_SOL: {},
  Sol_ETH: {},
  Sol_USDC: {},
};
const TokenIds: Record<string, Token> = {
  BTC: "Sol_BTC",
  SOL: "Sol_SOL",
  ETH: "Sol_ETH",
  USDC: "Sol_USDC",
};
const listeners = new Set<() => void>();
const emptyFeed: PriceFeed = {};
const emit = () => {
  for (const listener of listeners) {
    listener();
  }
};
const subscribe = (listener: () => void) => {
  if (listeners.size === 0) {
    pythConnection.start();
    pythConnection.onPriceChange((product, priceData) => {
      const token = TokenIds[product.base];
      if (!token) return;
      TokenPriceFeed[token] = {
        product,
        priceData,
      };
      emit();
    });
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) pythConnection.stop();
  };
};

const useWatchPythPriceFeed = (token: Token): PriceFeed => {
  return useSyncExternalStore(
    subscribe,
    () => TokenPriceFeed[token],
    () => emptyFeed,
  );
};

export { useWatchPythPriceFeed };
