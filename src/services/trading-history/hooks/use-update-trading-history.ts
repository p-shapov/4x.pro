import { useWallet } from "@solana/wallet-adapter-react";
import { createMutation } from "react-query-kit";

import type { Token } from "@4x.pro/app-config";
import { queryClient } from "@4x.pro/app-config";

import { useTradingHistoryQuery } from "./use-trading-history";
import { pushTransaction } from "../actions/push-transaction";
import type { TransactionData, TransactionType } from "../utils/types";

const useUpdateTradingHistoryMutation = createMutation({
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
    txData: TransactionData;
  }) => {
    await pushTransaction(account, token, type, time, txid, txData);
    queryClient.invalidateQueries({
      queryKey: useTradingHistoryQuery.getKey(),
    });
  },
});

const useUpdateTradingHistory = () => {
  const walletContextState = useWallet();
  const mutation = useUpdateTradingHistoryMutation();
  return {
    ...mutation,
    mutate: (params: {
      token: Token;
      type: TransactionType;
      time: number;
      txid: string;
      txData: TransactionData;
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
      txData: TransactionData;
    }) =>
      mutation.mutateAsync({
        ...params,
        account: walletContextState.publicKey!.toBase58(),
      }),
  };
};

export { useUpdateTradingHistory, useUpdateTradingHistoryMutation };
