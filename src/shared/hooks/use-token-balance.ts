import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";

import { fetchSplTokenBalance } from "../utils/retrieve-data";

const useTokenBalanceQuery = createQuery({
  queryKey: ["token-balance"],
  fetcher: async ({
    token,
    account,
    rpcEndpoint,
  }: {
    token?: Token;
    account?: string;
    rpcEndpoint?: string;
  }) => {
    if (!account || !token || !rpcEndpoint) return null;
    const connection = new Connection(rpcEndpoint);
    return fetchSplTokenBalance(token, account, connection);
  },
});

const useTokenBalance = ({
  token,
  account,
}: {
  token?: Token;
  account?: string;
}) => {
  const { rpcEndpoint } = useAppConfig();
  return useTokenBalanceQuery({
    variables: { token, account, rpcEndpoint },
  });
};

const useIsInsufficientBalance = ({
  token,
  amount,
}: {
  token?: Token;
  amount: number;
}) => {
  const { publicKey } = useWallet();
  const { rpcEndpoint } = useAppConfig();
  return useTokenBalanceQuery({
    variables: { token, account: publicKey?.toBase58(), rpcEndpoint },
    select: (data) => (data ? data < amount : true),
  });
};

export { useTokenBalanceQuery, useTokenBalance, useIsInsufficientBalance };
