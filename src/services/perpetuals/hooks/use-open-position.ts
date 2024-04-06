import { useConnection } from "@solana/wallet-adapter-react";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";
import { createMutation } from "react-query-kit";

import { queryClient, useAppConfig } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";

import { usePositionsQuery } from "./use-positions";
import { openPosition } from "../actions/open-position";
import type { PoolAccount } from "../lib/pool-account";
import type { Side } from "../lib/types";

const useOpenPositionQuery = createMutation({
  mutationFn: async ({
    rpcEndpoint,
    connection,
    walletContextState,
    pool,
    payToken,
    positionToken,
    payAmount,
    positionAmount,
    price,
    side,
    leverage,
    slippage,
  }: {
    rpcEndpoint: string;
    connection: Connection;
    walletContextState: WalletContextState;
    pool: PoolAccount;
    payToken: Token;
    positionToken: Token;
    payAmount: number;
    positionAmount: number;
    price: number;
    side: Side;
    leverage: number;
    slippage: number;
  }) => {
    const res = await openPosition(
      rpcEndpoint,
      connection,
      walletContextState,
      pool,
      payToken,
      positionToken,
      payAmount,
      positionAmount,
      price,
      side,
      leverage,
      slippage,
    );
    await queryClient.invalidateQueries({
      queryKey: usePositionsQuery.getKey(),
    });
    return res;
  },
});

const useOpenPosition = () => {
  const { rpcEndpoint } = useAppConfig();
  const { connection } = useConnection();
  const mutation = useOpenPositionQuery();
  return {
    ...mutation,
    mutate: (params: {
      walletContextState: WalletContextState;
      pool: PoolAccount;
      payToken: Token;
      positionToken: Token;
      payAmount: number;
      positionAmount: number;
      price: number;
      side: Side;
      leverage: number;
      slippage: number;
    }) => mutation.mutate({ ...params, connection, rpcEndpoint }),
    mutateAsync: async (params: {
      walletContextState: WalletContextState;
      pool: PoolAccount;
      payToken: Token;
      positionToken: Token;
      payAmount: number;
      positionAmount: number;
      price: number;
      side: Side;
      leverage: number;
      slippage: number;
    }) => mutation.mutateAsync({ ...params, connection, rpcEndpoint }),
  };
};

export { useOpenPositionQuery, useOpenPosition };
