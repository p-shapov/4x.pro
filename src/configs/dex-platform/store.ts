import {
  PythConnection,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";
import { Connection, PublicKey } from "@solana/web3.js";
import * as yup from "yup";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { rpcProviders } from "./config";
import type { RpcProvider } from "./config";
import { getPythFeedIds_to_USD, getRpcEndpoint } from "./utils";

type Store = {
  hydrated: boolean;
  pythConnection: PythConnection | null;
  rpcEndpoint: string;
  rpcProvider: RpcProvider | "custom";
};
type Actions = {
  setRpcProvider: (rpcProvider: RpcProvider) => void;
  setRpcEndpoint: (rpcEndpoint: string) => void;
};

const localStorageSchema = yup.object({
  rpcEndpoint: yup.string().required(),
  rpcProvider: yup.string().oneOf(rpcProviders).required(),
});
const pythProgramKey = getPythProgramKeyForCluster(
  process.env.NEXT_PUBLIC_IS_DEVNET === "true" ? "devnet" : "mainnet-beta",
);
const pythFeedIds_to_USD = getPythFeedIds_to_USD();

const useDexPlatformConfig = create<Store & Actions>()(
  persist(
    immer((set) => ({
      hydrated: false,
      pythConnection: null,
      rpcEndpoint: getRpcEndpoint("helius"),
      rpcProvider: "helius",
      setRpcProvider: (rpcProvider) => {
        set((state) => {
          state.rpcProvider = rpcProvider;
          const rpcEndpoint = getRpcEndpoint(rpcProvider);
          const solanaConnection = new Connection(rpcEndpoint);
          state.pythConnection?.stop();
          state.pythConnection = new PythConnection(
            solanaConnection,
            pythProgramKey,
            solanaConnection.commitment,
            pythFeedIds_to_USD.map((feedId) => new PublicKey(feedId)),
          );
          state.rpcEndpoint = rpcEndpoint;
        });
      },
      setRpcEndpoint: (rpcEndpoint) => {
        set((state) => {
          state.rpcEndpoint = rpcEndpoint;
          const connection = new Connection(rpcEndpoint);
          state.pythConnection?.stop();
          state.pythConnection = new PythConnection(
            connection,
            pythProgramKey,
            connection.commitment,
            pythFeedIds_to_USD.map((feedId) => new PublicKey(feedId)),
          );
          state.rpcProvider = "custom";
        });
      },
    })),
    {
      name: "4xpro-dex-platform-config",
      partialize: (state) => ({
        rpcProvider: state.rpcProvider,
        rpcEndpoint: state.rpcEndpoint,
      }),
      merge: (persistedState, state) => {
        if (persistedState && localStorageSchema.isType(persistedState)) {
          const connection = new Connection(persistedState.rpcEndpoint);
          const pythConnection = new PythConnection(
            connection,
            pythProgramKey,
            connection.commitment,
            pythFeedIds_to_USD.map((feedId) => new PublicKey(feedId)),
          );
          return {
            ...state,
            ...persistedState,
            pythConnection,
            hydrated: true,
          };
        }
        const connection = new Connection(state.rpcEndpoint);
        const pythConnection = new PythConnection(
          connection,
          pythProgramKey,
          connection.commitment,
          pythFeedIds_to_USD.map((feedId) => new PublicKey(feedId)),
        );
        return { ...state, pythConnection, hydrated: true };
      },
    },
  ),
);

export { useDexPlatformConfig };
