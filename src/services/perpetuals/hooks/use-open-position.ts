import type { WalletContextState } from "@solana/wallet-adapter-react";
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
    walletContextState,
    pool,
    payToken,
    positionToken,
    payAmount,
    positionAmount,
    price,
    side,
    leverage,
  }: {
    rpcEndpoint: string;
    walletContextState: WalletContextState;
    pool: PoolAccount;
    payToken: Token;
    positionToken: Token;
    payAmount: number;
    positionAmount: number;
    price: number;
    side: Side;
    leverage: number;
  }) => {
    const res = await openPosition(
      rpcEndpoint,
      walletContextState,
      pool,
      payToken,
      positionToken,
      payAmount,
      positionAmount,
      price,
      side,
      leverage,
    );
    await queryClient.invalidateQueries({
      queryKey: usePositionsQuery.getKey(),
    });
    return res;
  },
});

const useOpenPosition = () => {
  const { rpcEndpoint } = useAppConfig();
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
    }) => mutation.mutate({ ...params, rpcEndpoint }),
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
    }) => mutation.mutateAsync({ ...params, rpcEndpoint }),
  };
};

export { useOpenPositionQuery, useOpenPosition };
