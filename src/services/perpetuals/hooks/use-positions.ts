import { useWallet } from "@solana/wallet-adapter-react";
import type { InitialDataFunction } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";

import { useCustodies } from "./use-custodies";
import { getPositionData } from "../fetchers/fetch-positions";
import type { CustodyAccount } from "../lib/custody-account";
import type { PositionAccount } from "../lib/position-account";

const usePositionsQuery = createQuery({
  queryKey: ["positions"],
  fetcher: async ({
    rpcEndpoint,
    custodyInfos,
  }: {
    rpcEndpoint: string;
    custodyInfos?: Record<string, CustodyAccount> | null;
  }) => {
    if (!custodyInfos) return null;
    return getPositionData(rpcEndpoint, custodyInfos);
  },
  initialData: keepPreviousData as InitialDataFunction<Record<
    string,
    PositionAccount
  > | null>,
  refetchInterval: 60 * 1 * 1000,
  queryKeyHashFn: (queryKey) => {
    const key = queryKey[0];
    const { rpcEndpoint, custodyInfos } = queryKey[1] as {
      rpcEndpoint: string;
      custodyInfos?: Record<string, CustodyAccount> | null;
    };
    return `${key}-${rpcEndpoint}-${Object.keys(custodyInfos || {}).join(",")}`;
  },
});

const usePositions = () => {
  const { rpcEndpoint } = useAppConfig();
  const { data: custodyInfos } = useCustodies();
  return usePositionsQuery({
    variables: { rpcEndpoint, custodyInfos },
  });
};

const useUserPositions = () => {
  const { rpcEndpoint } = useAppConfig();
  const { data: custodyInfos } = useCustodies();
  const walletContextState = useWallet();
  return usePositionsQuery({
    variables: { rpcEndpoint, custodyInfos },
    select: (positions): Record<string, PositionAccount> | null => {
      if (!positions) return null;
      return Object.entries(positions).reduce(
        (positions, [address, data]) => {
          const ownerIsUser =
            data.owner.toBase58() === walletContextState.publicKey?.toBase58();
          if (ownerIsUser) {
            positions[address] = data;
          }
          return positions;
        },
        {} as Record<string, PositionAccount>,
      );
    },
  });
};

const useUserPositionOrders = () => {
  const { rpcEndpoint } = useAppConfig();
  const { data: custodyInfos } = useCustodies();
  const walletContextState = useWallet();
  return usePositionsQuery({
    variables: { rpcEndpoint, custodyInfos },
    select: (positions): Record<string, PositionAccount> | null => {
      if (!positions) return null;
      return Object.entries(positions).reduce(
        (positions, [address, data]) => {
          const ownerIsUser =
            data.owner.toBase58() === walletContextState.publicKey?.toBase58();
          const isOrder = data.stopLoss || data.takeProfit;
          if (ownerIsUser && isOrder) {
            positions[address] = data;
          }
          return positions;
        },
        {} as Record<string, PositionAccount>,
      );
    },
  });
};

export {
  usePositionsQuery,
  usePositions,
  useUserPositions,
  useUserPositionOrders,
};
