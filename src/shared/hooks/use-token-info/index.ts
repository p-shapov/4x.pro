import type {
  PythConnection,
  PythPriceCallback,
} from "@pythnetwork/client/lib/PythConnection";
import { useEffect } from "react";
import { create } from "zustand";

import { createPythConnectionForFeedId } from "@4x.pro/configs/pyth-network-client";
import type { Token } from "@4x.pro/configs/token-config";
import { tokenConfig } from "@4x.pro/configs/token-config";

const pythConnectionsMap = new Map<Token, PythConnection>();

type TokenProductInfo = Parameters<PythPriceCallback>[0];
type TokenPriceInfo = Parameters<PythPriceCallback>[1];

const useWatchTokenInfoStore = create<{
  tokenInfoRecord: Partial<
    Record<
      Token,
      {
        product: TokenProductInfo;
        priceData: TokenPriceInfo;
      }
    >
  >;
  connectionsRecord: Record<Token, number>;
  incrementConnectionsCount: (token: Token) => void;
  decrementConnectionsCount: (token: Token) => void;
  setTokenInfo: (
    token: Token,
    priceInfo: Parameters<PythPriceCallback>,
  ) => void;
}>((set) => ({
  tokenInfoRecord: {},
  connectionsRecord: {
    BTC: 0,
    ETH: 0,
    SOL: 0,
    USDC: 0,
  },
  incrementConnectionsCount: (token: Token) => {
    set((state) => ({
      connectionsRecord: {
        ...state.connectionsRecord,
        [token]: state.connectionsRecord[token] + 1,
      },
    }));
  },
  decrementConnectionsCount: (token: Token) => {
    set((state) => ({
      connectionsRecord: {
        ...state.connectionsRecord,
        [token]: state.connectionsRecord[token] - 1,
      },
    }));
  },
  setTokenInfo: (
    token: Token,
    [product, priceData]: Parameters<PythPriceCallback>,
  ) => {
    set((state) => ({
      tokenInfoRecord: {
        ...state.tokenInfoRecord,
        [token]: {
          product,
          priceData,
        },
      },
    }));
  },
}));

const useWatchTokenInfo = (token: Token, watch: boolean = true) => {
  const connectionsRecord = useWatchTokenInfoStore(
    (state) => state.connectionsRecord,
  );
  const setTokenInfo = useWatchTokenInfoStore((state) => state.setTokenInfo);
  const incrementConnectionsCount = useWatchTokenInfoStore(
    (state) => state.incrementConnectionsCount,
  );
  const decrementConnectionsCount = useWatchTokenInfoStore(
    (state) => state.decrementConnectionsCount,
  );
  useEffect(() => {
    if (watch) {
      if (connectionsRecord[token] === 0) {
        if (!pythConnectionsMap.has(token)) {
          const pythConnection = createPythConnectionForFeedId(
            tokenConfig.PythFeedIds_to_USD[token],
          );
          pythConnectionsMap.set(token, pythConnection);
          pythConnection.onPriceChange((...tokenInfo) => {
            setTokenInfo(token, tokenInfo);
          });
          pythConnection.start();
        }
      }
      incrementConnectionsCount(token);

      return () => {
        decrementConnectionsCount(token);
        if (connectionsRecord[token] === 0) {
          pythConnectionsMap.get(token)?.stop();
          pythConnectionsMap.delete(token);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, watch]);

  return useWatchTokenInfoStore(
    (state) =>
      state.tokenInfoRecord[token] ||
      ({} as {
        product?: TokenProductInfo;
        priceData?: TokenPriceInfo;
      }),
  );
};

export { useWatchTokenInfo };
