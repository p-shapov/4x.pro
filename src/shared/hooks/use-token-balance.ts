import { useWallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";

import { fetchTokenBalance } from "../utils/retrieve-data";

const useTokenBalanceQuery = createQuery({
  queryKey: ["token-balance"],
  fetcher: async ({
    token,
    account,
    rpcEndpoint,
    address,
  }: {
    token: Token;
    account: PublicKey | null;
    rpcEndpoint: string;
    address?: PublicKey;
  }) => {
    if (!account) return null;
    const connection = new Connection(rpcEndpoint);
    return fetchTokenBalance(token, account, connection, address);
  },
  queryKeyHashFn: (queryKey) => {
    const key = queryKey[0] as string;
    const variables = queryKey[1] as {
      token?: Token;
      account?: PublicKey;
      rpcEndpoint?: string;
      address?: PublicKey;
    };
    return `${key}-${
      variables.token
    }-${variables.account?.toBase58()}-${variables.address?.toBase58()}`;
  },
});

const useTokenBalance = ({
  token,
  account,
  address,
}: {
  token: Token;
  account: PublicKey | null;
  address?: PublicKey;
}) => {
  const { rpcEndpoint } = useAppConfig();
  return useTokenBalanceQuery({
    variables: { token, account, rpcEndpoint, address },
  });
};

const useIsInsufficientBalance = ({
  token,
  amount,
  address,
}: {
  token: Token;
  amount: number;
  address?: PublicKey;
}) => {
  const walletContextState = useWallet();
  const { rpcEndpoint } = useAppConfig();
  return useTokenBalanceQuery({
    variables: {
      token,
      account: walletContextState.publicKey,
      rpcEndpoint,
      address,
    },
    select: (data) => (data ? data < amount : true),
  });
};

export { useTokenBalanceQuery, useTokenBalance, useIsInsufficientBalance };
