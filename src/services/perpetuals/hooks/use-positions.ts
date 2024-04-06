import { useWallet } from "@solana/wallet-adapter-react";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";

import { useCustodies } from "./use-custodies";
import { getPositionData } from "../fetchers/fetch-positions";
import type { CustodyAccount } from "../lib/custody-account";
import type { PositionAccount } from "../lib/position-account";

const usePositionsQuery = createQuery({
  queryKey: ["positions"],
  fetcher: ({
    rpcEndpoint,
    custodyInfos,
  }: {
    rpcEndpoint: string;
    custodyInfos?: Record<string, CustodyAccount>;
  }) => {
    if (!custodyInfos) return null;
    return getPositionData(rpcEndpoint, custodyInfos);
  },
  staleTime: 0,
  gcTime: 0,
});

const usePositions = () => {
  const { rpcEndpoint } = useAppConfig();
  const { data: custodyInfos } = useCustodies();
  return usePositionsQuery({
    variables: { rpcEndpoint, custodyInfos },
    enabled: !!custodyInfos,
  });
};

const useUserPositions = () => {
  const { rpcEndpoint } = useAppConfig();
  const { data: custodyInfos } = useCustodies();
  const walletContextState = useWallet();
  return usePositionsQuery({
    variables: { rpcEndpoint, custodyInfos },
    enabled: !!custodyInfos,
    select: (positions): Record<string, PositionAccount> => {
      if (!positions) return {};
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

export { usePositionsQuery, usePositions, useUserPositions };
