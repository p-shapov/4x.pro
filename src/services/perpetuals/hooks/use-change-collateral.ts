import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";
import { createMutation } from "react-query-kit";

import { queryClient, useAppConfig } from "@4x.pro/app-config";

import { usePositionsQuery } from "./use-positions";
import { changeCollateral } from "../actions/change-collateral";
import type { PoolAccount } from "../lib/pool-account";
import type { PositionAccount } from "../lib/position-account";
import type { ChangeCollateralTxType } from "../lib/types";

const useChangeCollateralMutation = createMutation({
  mutationKey: ["change-collateral"],
  mutationFn: async ({
    rpcEndpoint,
    connection,
    walletContextState,
    pool,
    position,
    collatNum,
    type,
  }: {
    rpcEndpoint: string;
    connection: Connection;
    walletContextState: WalletContextState;
    pool: PoolAccount;
    position: PositionAccount;
    collatNum: number;
    type: ChangeCollateralTxType;
  }) => {
    const res = await changeCollateral(
      type,
      rpcEndpoint,
      connection,
      walletContextState,
      pool,
      position,
      collatNum,
    );
    await queryClient.invalidateQueries({
      queryKey: usePositionsQuery.getKey(),
    });
    return res;
  },
});

const useChangeCollateral = () => {
  const walletContextState = useWallet();
  const { rpcEndpoint } = useAppConfig();
  const { connection } = useConnection();
  const mutation = useChangeCollateralMutation({});
  return {
    ...mutation,
    mutate: (params: {
      type: ChangeCollateralTxType;
      pool: PoolAccount;
      position: PositionAccount;
      collatNum: number;
    }) =>
      mutation.mutate({
        ...params,
        walletContextState,
        connection,
        rpcEndpoint,
      }),
    mutateAsync: async (params: {
      type: ChangeCollateralTxType;
      pool: PoolAccount;
      position: PositionAccount;
      collatNum: number;
    }) =>
      mutation.mutateAsync({
        ...params,
        walletContextState,
        connection,
        rpcEndpoint,
      }),
  };
};

export { useChangeCollateralMutation, useChangeCollateral };
