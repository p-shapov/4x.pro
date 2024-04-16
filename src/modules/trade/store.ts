import * as yup from "yup";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { coinList } from "@4x.pro/app-config";
import type { Coin } from "@4x.pro/app-config";

type Store = {
  hydrated: boolean;
  selectedAsset: Coin;
  favorites: readonly Coin[];
};

type Actions = {
  selectAsset: (token: Coin) => void;
  addFavorite: (token: Coin) => void;
  toggleFavorite: (token: Coin) => void;
  removeFavorite: (token: Coin) => void;
};

const storeSchema = yup.object<Store>({
  hydrated: yup.boolean(),
  selectedAsset: yup.string().oneOf(coinList).required(),
  favorites: yup.array().of(yup.string().oneOf(coinList).required()).required(),
});

const useTradeModule = create<Store & Actions>()(
  persist(
    immer((set) => ({
      hydrated: false,
      selectedAsset: "SOL",
      favorites: ["SOL"] as const,
      selectAsset: (token: Coin) => set({ selectedAsset: token }),
      addFavorite: (token: Coin) =>
        set((state) => {
          if (!state.favorites) {
            state.favorites = [];
          } else if (!state.favorites.includes(token)) {
            state.favorites.push(token);
          }
        }),
      removeFavorite: (token: Coin) =>
        set((state) => {
          if (state.favorites) {
            state.favorites = state.favorites.filter((t) => t !== token);
          }
        }),
      toggleFavorite: (token: Coin) =>
        set((state) => {
          if (!state.favorites) {
            state.favorites = [token];
          } else if (state.favorites.includes(token)) {
            state.favorites = state.favorites.filter((t) => t !== token);
          } else {
            state.favorites.push(token);
          }
        }),
    })),
    {
      name: "4xprotocol-trade-module",
      partialize: (state) => ({
        selectedAsset: state.selectedAsset,
        favorites: state.favorites,
      }),
      merge: (persistedState, state) => {
        if (storeSchema.isValidSync(persistedState)) {
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

export { useTradeModule };
