import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";
import { createMutation } from "react-query-kit";

import { queryClient, useAppConfig } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";
import { useTokenBalanceQuery } from "@4x.pro/shared/hooks/use-token-balance";

import { usePositionsQuery } from "./use-positions";
import { openPosition } from "../actions/open-position";
import type { PoolAccount } from "../lib/pool-account";
import type { PositionSide } from "../lib/types";

const useOpenPositionMutation = createMutation({
  mutationKey: ["open-position"],
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
    stopLoss,
    takeProfit,
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
    side: PositionSide;
    leverage: number;
    slippage: number;
    stopLoss: number | null;
    takeProfit: number | null;
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
      stopLoss,
      takeProfit,
    );
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: usePositionsQuery.getKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: useTokenBalanceQuery.getKey(),
      }),
    ]);
    return res;
  },
});

const useOpenPosition = () => {
  const walletContextState = useWallet();
  const { rpcEndpoint } = useAppConfig();
  const { connection } = useConnection();
  const mutation = useOpenPositionMutation();
  return {
    ...mutation,
    mutate: (params: {
      pool: PoolAccount;
      payToken: Token;
      positionToken: Token;
      payAmount: number;
      positionAmount: number;
      price: number;
      side: PositionSide;
      leverage: number;
      slippage: number;
      stopLoss: number | null;
      takeProfit: number | null;
    }) =>
      mutation.mutate({
        ...params,
        walletContextState,
        connection,
        rpcEndpoint,
      }),
    mutateAsync: async (params: {
      pool: PoolAccount;
      payToken: Token;
      positionToken: Token;
      payAmount: number;
      positionAmount: number;
      price: number;
      side: PositionSide;
      leverage: number;
      slippage: number;
      stopLoss: number | null;
      takeProfit: number | null;
    }) =>
      mutation.mutateAsync({
        ...params,
        walletContextState,
        connection,
        rpcEndpoint,
      }),
  };
};

export { useOpenPositionMutation, useOpenPosition };
