import type { PublicKey } from "@solana/web3.js";
import type { InitialDataFunction } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

import { getHistory } from "../fetchers/fetch-history";
import type { Transaction } from "../utils/types";

const useTradingHistoryQuery = createQuery({
  queryKey: ["history"],
  fetcher: async ({ account }: { account?: string }) => {
    if (!account) return [];
    return getHistory(account);
  },
  initialData: keepPreviousData as InitialDataFunction<Transaction[]>,
});

const useTradingHistory = ({ owner }: { owner?: PublicKey | null }) => {
  return useTradingHistoryQuery({
    variables: { account: owner?.toBase58() },
  });
};

export { useTradingHistory, useTradingHistoryQuery };
