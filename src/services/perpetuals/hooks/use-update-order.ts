import type { WalletContextState } from "@solana/wallet-adapter-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";
import { createMutation } from "react-query-kit";

import { queryClient, useAppConfig } from "@4x.pro/app-config";

import { usePositionsQuery } from "./use-positions";
import { updateOrder } from "../actions/update-order";
import type { PoolAccount } from "../lib/pool-account";
import type { PositionAccount } from "../lib/position-account";
import type { OrderTxType } from "../lib/types";

const useUpdateOrderMutation = createMutation({
  mutationKey: ["update-limit"],
  mutationFn: async ({
    type,
    rpcEndpoint,
    connection,
    walletContextState,
    pool,
    position,
    triggerPrice,
  }: {
    type: OrderTxType;
    rpcEndpoint: string;
    connection: Connection;
    walletContextState: WalletContextState;
    pool: PoolAccount;
    position: PositionAccount;
    triggerPrice: number | null;
  }) => {
    const res = await updateOrder(
      type,
      rpcEndpoint,
      connection,
      walletContextState,
      pool,
      position,
      triggerPrice,
    );
    await queryClient.invalidateQueries({
      queryKey: usePositionsQuery.getKey(),
    });
    return res;
  },
});

const useUpdateOrder = () => {
  const { rpcEndpoint } = useAppConfig();
  const walletContextState = useWallet();
  const { connection } = useConnection();
  const mutation = useUpdateOrderMutation();
  return {
    ...mutation,
    mutate: ({
      type,
      pool,
      position,
      triggerPrice,
    }: {
      type: OrderTxType;
      pool: PoolAccount;
      position: PositionAccount;
      triggerPrice: number | null;
    }) =>
      mutation.mutate({
        type,
        rpcEndpoint,
        connection,
        walletContextState,
        pool,
        position,
        triggerPrice,
      }),
    mutateAsync: ({
      type,
      pool,
      position,
      triggerPrice,
    }: {
      type: OrderTxType;
      pool: PoolAccount;
      position: PositionAccount;
      triggerPrice: number | null;
    }) =>
      mutation.mutateAsync({
        type,
        rpcEndpoint,
        connection,
        walletContextState,
        pool,
        position,
        triggerPrice,
      }),
  };
};

export { useUpdateOrder, useUpdateOrderMutation };
