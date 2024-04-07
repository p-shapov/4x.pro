import type { WalletContextState } from "@solana/wallet-adapter-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";
import { createMutation } from "react-query-kit";

import { queryClient, useAppConfig } from "@4x.pro/app-config";

import { usePositionsQuery } from "./use-positions";
import { closePosition } from "../actions/close-position";
import type { CustodyAccount } from "../lib/custody-account";
import type { PoolAccount } from "../lib/pool-account";
import type { PositionAccount } from "../lib/position-account";

const useClosePositionMutation = createMutation({
  mutationKey: ["close-position"],
  mutationFn: async ({
    rpcEndpoint,
    walletContextState,
    connection,
    pool,
    position,
    custody,
    price,
    slippage,
  }: {
    rpcEndpoint: string;
    walletContextState: WalletContextState;
    connection: Connection;
    pool: PoolAccount;
    position: PositionAccount;
    custody: CustodyAccount;
    price: number;
    slippage: number;
  }) => {
    const res = await closePosition(
      rpcEndpoint,
      walletContextState,
      connection,
      pool,
      position,
      custody,
      price,
      slippage,
    );
    await queryClient.invalidateQueries({
      queryKey: usePositionsQuery.getKey(),
    });
    return res;
  },
});

const useClosePosition = () => {
  const walletContextState = useWallet();
  const { rpcEndpoint } = useAppConfig();
  const { connection } = useConnection();
  const mutation = useClosePositionMutation();
  return {
    ...mutation,
    mutate: (params: {
      pool: PoolAccount;
      position: PositionAccount;
      custody: CustodyAccount;
      price: number;
      slippage: number;
    }) =>
      mutation.mutate({
        rpcEndpoint,
        walletContextState,
        connection,
        ...params,
      }),
    mutateAsync: async (params: {
      pool: PoolAccount;
      position: PositionAccount;
      custody: CustodyAccount;
      price: number;
      slippage: number;
    }) =>
      mutation.mutateAsync({
        rpcEndpoint,
        walletContextState,
        connection,
        ...params,
      }),
  };
};

export { useClosePosition, useClosePositionMutation };
