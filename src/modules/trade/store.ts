import * as yup from "yup";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { tokenList } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";

type Store = {
  hydrated: boolean;
  selectedAsset: Token;
  favorites: readonly Token[];
};

type Actions = {
  selectAsset: (token: Token) => void;
  addFavorite: (token: Token) => void;
  toggleFavorite: (token: Token) => void;
  removeFavorite: (token: Token) => void;
};

const storeSchema = yup.object<Store>({
  hydrated: yup.boolean(),
  selectedAsset: yup.string().oneOf(tokenList).required(),
  favorites: yup
    .array()
    .of(yup.string().oneOf(tokenList).required())
    .required(),
});

const useTradeModule = create<Store & Actions>()(
  persist(
    immer((set) => ({
      hydrated: false,
      selectedAsset: "SOL",
      favorites: ["SOL"] as const,
      selectAsset: (token: Token) => set({ selectedAsset: token }),
      addFavorite: (token: Token) =>
        set((state) => {
          if (!state.favorites) {
            state.favorites = [];
          } else if (!state.favorites.includes(token)) {
            state.favorites.push(token);
          }
        }),
      removeFavorite: (token: Token) =>
        set((state) => {
          if (state.favorites) {
            state.favorites = state.favorites.filter((t) => t !== token);
          }
        }),
      toggleFavorite: (token: Token) =>
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
