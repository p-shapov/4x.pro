import { useWallet } from "@solana/wallet-adapter-react";
import type { InitialDataFunction } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

import { getHistory } from "../fetchers/fetch-history";
import type { Transaction } from "../utils/types";

const useTradingHistoryQuery = createQuery({
  queryKey: ["history"],
  fetcher: async ({ account }: { account?: string }) => {
    if (!account) return null;
    return getHistory(account);
  },
  initialData: keepPreviousData as InitialDataFunction<Transaction[] | null>,
  staleTime: 0,
  gcTime: 0,
});

const useTradingHistory = () => {
  const walletContextState = useWallet();
  return useTradingHistoryQuery({
    variables: { account: walletContextState.publicKey?.toBase58() },
  });
};

export { useTradingHistory, useTradingHistoryQuery };
