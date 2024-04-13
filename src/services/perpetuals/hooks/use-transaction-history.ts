import { useWallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";
import type { InitialDataFunction } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { createQuery, createMutation } from "react-query-kit";

import type { Token } from "@4x.pro/app-config";
import { queryClient } from "@4x.pro/app-config";

import { pushTransaction } from "../actions/push-transaction";
import { getHistory } from "../fetchers/fetch-history";
import type {
  TransactionLog,
  TransactionLogData,
  TransactionType,
} from "../lib/types";

const useTransactionHistoryQuery = createQuery({
  queryKey: ["history"],
  fetcher: async ({ account }: { account?: string }) => {
    if (!account) return [];
    return getHistory(account);
  },
  placeholderData: keepPreviousData as InitialDataFunction<TransactionLog[]>,
});

const useTransactionHistory = ({ owner }: { owner?: PublicKey | null }) => {
  return useTransactionHistoryQuery({
    variables: { account: owner?.toBase58() },
  });
};

const useTransactionHistoryMutation = createMutation({
  mutationKey: ["update-trading-history"],
  mutationFn: async ({
    account,
    token,
    type,
    time,
    txid,
    txData,
  }: {
    account: string;
    token: Token;
    type: TransactionType;
    time: number;
    txid: string;
    txData: TransactionLogData;
  }) => {
    await pushTransaction(account, token, type, time, txid, txData);
    queryClient.invalidateQueries({
      queryKey: useTransactionHistoryQuery.getKey(),
    });
  },
});

const useLogTransaction = () => {
  const walletContextState = useWallet();
  const mutation = useTransactionHistoryMutation();
  return {
    ...mutation,
    mutate: (params: {
      token: Token;
      type: TransactionType;
      time: number;
      txid: string;
      txData: TransactionLogData;
    }) =>
      mutation.mutate({
        ...params,
        account: walletContextState.publicKey!.toBase58(),
      }),
    mutateAsync: async (params: {
      token: Token;
      type: TransactionType;
      time: number;
      txid: string;
      txData: TransactionLogData;
    }) =>
      mutation.mutateAsync({
        ...params,
        account: walletContextState.publicKey!.toBase58(),
      }),
  };
};

export {
  useTransactionHistory,
  useTransactionHistoryQuery,
  useLogTransaction,
  useTransactionHistoryMutation,
};
