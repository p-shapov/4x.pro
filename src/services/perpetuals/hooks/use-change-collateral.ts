import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";
import { createMutation } from "react-query-kit";

import { queryClient, useAppConfig } from "@4x.pro/app-config";

import { usePositionsQuery } from "./use-positions";
import { changeCollateral } from "../actions/change-collateral";
import type { PoolAccount } from "../lib/pool-account";
import type { PositionAccount } from "../lib/position-account";
import type { Tab } from "../lib/types";

const useChangeCollateralMutation = createMutation({
  mutationKey: ["change-collateral"],
  mutationFn: async ({
    rpcEndpoint,
    walletContextState,
    connection,
    pool,
    position,
    collatNum,
    tab,
  }: {
    rpcEndpoint: string;
    walletContextState: WalletContextState;
    connection: Connection;
    pool: PoolAccount;
    position: PositionAccount;
    collatNum: number;
    tab: Tab;
  }) => {
    const res = await changeCollateral(
      rpcEndpoint,
      walletContextState,
      connection,
      pool,
      position,
      collatNum,
      tab,
    );
    await queryClient.invalidateQueries({
      queryKey: usePositionsQuery.getKey(),
    });
    return res;
  },
});

const useChangeCollateral = () => {
  const { rpcEndpoint } = useAppConfig();
  const mutation = useChangeCollateralMutation({});
  return {
    ...mutation,
    mutate: (params: {
      walletContextState: WalletContextState;
      connection: Connection;
      pool: PoolAccount;
      position: PositionAccount;
      collatNum: number;
      tab: Tab;
    }) => mutation.mutate({ ...params, rpcEndpoint }),
    mutateAsync: async (params: {
      walletContextState: WalletContextState;
      connection: Connection;
      pool: PoolAccount;
      position: PositionAccount;
      collatNum: number;
      tab: Tab;
    }) => mutation.mutateAsync({ ...params, rpcEndpoint }),
  };
};

export { useChangeCollateralMutation, useChangeCollateral };
