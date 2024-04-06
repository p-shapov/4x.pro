import { useWallet } from "@solana/wallet-adapter-react";
import { createQuery } from "react-query-kit";

import { getHistory } from "../fetchers/fetch-history";

const useTradingHistoryQuery = createQuery({
  queryKey: ["history"],
  fetcher: async ({ account }: { account?: string }) => {
    if (!account) return null;
    return getHistory(account);
  },
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
