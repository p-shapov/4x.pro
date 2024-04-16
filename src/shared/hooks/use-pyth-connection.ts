import type { PriceData, Product } from "@pythnetwork/client";
import {
  PythConnection,
  PythHttpClient,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createQuery } from "react-query-kit";

import type { Coin } from "@4x.pro/app-config";
import {
  getPythFeedIds_to_USD,
  getRpcEndpoint,
  getTokenPythFeedId_to_USD,
  useAppConfig,
} from "@4x.pro/app-config";

const connectionsMap = new Map<string, PythConnection>();
const pythProgramKey = getPythProgramKeyForCluster(
  process.env.NEXT_PUBLIC_IS_DEVNET === "true" ? "devnet" : "mainnet-beta",
);
const pythFeedIds_to_USD = getPythFeedIds_to_USD().filter(Boolean);

const usePythConnection = () => {
  const { rpcEndpoint } = useAppConfig();
  const pythConnection = useMemo(() => {
    const connection = new Connection(rpcEndpoint);
    let pythConnection = connectionsMap.get(rpcEndpoint);
    if (!pythConnection) {
      pythConnection = new PythConnection(
        connection,
        pythProgramKey,
        "confirmed",
        pythFeedIds_to_USD.map((feedId) => new PublicKey(feedId)),
      );
      connectionsMap.set(
        process.env.NODE_ENV === "development"
          ? getRpcEndpoint("helius")
          : rpcEndpoint,
        pythConnection,
      );
    }
    return pythConnection;
  }, [rpcEndpoint]);

  return pythConnection;
};

type PriceFeed = {
  product?: Product;
  priceData?: PriceData;
};

const PriceFeeds: Record<Coin, PriceFeed> = {
  SOL: {},
  USDC: {},
  LTC: {},
};

const TokenMap: Record<string, Coin> = {
  SOL: "SOL",
  USDC: "USDC",
  LTC: "LTC",
};
const listeners = new Set<() => void>();
const emit = () => {
  listeners.forEach((listener) => listener());
};

const useWatchPythPriceFeed = (token?: Coin): PriceFeed => {
  const pythConnection = usePythConnection();
  return useSyncExternalStore<PriceFeed>(
    (listener) => {
      if (listeners.size === 0) {
        pythConnection.onPriceChange((product, priceData) => {
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
    () => (token ? PriceFeeds[token] : {}),
    () => ({}),
  );
};

const usePythPriceFeedQuery = createQuery({
  queryKey: ["pyth-price-feed"],
  fetcher: async ({
    token,
    rpcEndpoint,
  }: {
    token?: Coin;
    rpcEndpoint: string;
  }) => {
    if (!token) return null;
    const connection = new Connection(
      process.env.NODE_ENV === "development"
        ? getRpcEndpoint("helius")
        : rpcEndpoint,
    );
    const client = new PythHttpClient(connection, pythProgramKey, "confirmed");
    const [priceData] = await client.getAssetPricesFromAccounts([
      new PublicKey(getTokenPythFeedId_to_USD(token)),
    ]);
    return priceData;
  },
  staleTime: 0,
  gcTime: 0,
});

const usePythPriceFeed = ({ token }: { token?: Coin }) => {
  const { rpcEndpoint } = useAppConfig();
  return usePythPriceFeedQuery({
    variables: {
      token,
      rpcEndpoint,
    },
  });
};

const useInitPythConnection = () => {
  const pythConnection = usePythConnection();
  useEffect(() => {
    pythConnection.start();
    return () => {
      pythConnection.stop();
    };
  }, [pythConnection]);
};

export {
  usePythPriceFeedQuery,
  usePythConnection,
  usePythPriceFeed,
  useWatchPythPriceFeed,
  useInitPythConnection,
};
