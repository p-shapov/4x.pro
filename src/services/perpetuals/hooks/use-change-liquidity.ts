import type { WalletContextState } from "@solana/wallet-adapter-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";
import { createMutation } from "react-query-kit";

import { queryClient, useAppConfig } from "@4x.pro/app-config";
import { useTokenBalanceQuery } from "@4x.pro/shared/hooks/use-token-balance";

import { usePoolsQuery } from "./use-pools";
import { changeLiquidity } from "../actions/change-liquidity";
import type { CustodyAccount } from "../lib/custody-account";
import type { PoolAccount } from "../lib/pool-account";
import type { ChangeLiquidityTxType } from "../lib/types";

const useChangeLiquidityMutation = createMutation({
  mutationKey: ["change-liquidity"],
  mutationFn: async ({
    type,
    rpcEndpoint,
    walletContextState,
    connection,
    pool,
    custody,
    tokenAmount,
    liquidityAmount,
  }: {
    type: ChangeLiquidityTxType;
    rpcEndpoint: string;
    walletContextState: WalletContextState;
    connection: Connection;
    pool: PoolAccount;
    custody: CustodyAccount;
    tokenAmount: number;
    liquidityAmount: number;
  }) => {
    const res = await changeLiquidity(
      type,
      rpcEndpoint,
      walletContextState,
      connection,
      pool,
      custody,
      tokenAmount,
      liquidityAmount,
    );
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: useTokenBalanceQuery.getKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: usePoolsQuery.getKey(),
      }),
    ]);
    return res;
  },
});

const useChangeLiquidity = () => {
  const mutation = useChangeLiquidityMutation();
  const walletContextState = useWallet();
  const { rpcEndpoint } = useAppConfig();
  const { connection } = useConnection();
  return {
    ...mutation,
    mutate: (data: {
      type: ChangeLiquidityTxType;
      pool: PoolAccount;
      custody: CustodyAccount;
      tokenAmount: number;
      liquidityAmount: number;
    }) =>
      mutation.mutate({
        ...data,
        walletContextState,
        rpcEndpoint,
        connection,
      }),
    mutateAsync: async (data: {
      type: ChangeLiquidityTxType;
      pool: PoolAccount;
      custody: CustodyAccount;
      tokenAmount: number;
      liquidityAmount: number;
    }) =>
      mutation.mutateAsync({
        ...data,
        walletContextState,
        rpcEndpoint,
        connection,
      }),
  };
};

export { useChangeLiquidityMutation, useChangeLiquidity };
