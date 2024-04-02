import * as yup from "yup";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { rpcProviders } from "./config";
import type { RpcProvider } from "./config";
import { getRpcEndpoint } from "./utils";

type Store = {
  hydrated: boolean;
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

const rpcEndpoint =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8899/"
    : getRpcEndpoint("helius");
const rpcProvider =
  process.env.NODE_ENV === "development" ? "custom" : "helius";

const useAppConfig = create<Store & Actions>()(
  persist(
    immer((set) => ({
      hydrated: false,
      rpcEndpoint,
      rpcProvider,
      setRpcProvider: (rpcProvider) => {
        set((state) => {
          state.rpcProvider = rpcProvider;
          const rpcEndpoint = getRpcEndpoint(rpcProvider);
          state.rpcEndpoint = rpcEndpoint;
        });
      },
      setRpcEndpoint: (rpcEndpoint) => {
        set((state) => {
          state.rpcEndpoint = rpcEndpoint;
          state.rpcProvider = "custom";
        });
      },
    })),
    {
      name: "4xprotocol-app-config",
      partialize: (state) => ({
        rpcProvider: state.rpcProvider,
        rpcEndpoint: state.rpcEndpoint,
      }),
      merge: (persistedState, state) => {
        if (persistedState && localStorageSchema.isType(persistedState)) {
          return {
            ...state,
            ...persistedState,
            hydrated: true,
          };
        }
        return { ...state, hydrated: true };
      },
    },
  ),
);

export { useAppConfig };
