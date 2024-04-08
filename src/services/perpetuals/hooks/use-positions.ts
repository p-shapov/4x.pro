import type { PublicKey } from "@solana/web3.js";
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
    custodyInfos?: Record<string, CustodyAccount>;
  }) => {
    if (!custodyInfos) return {};
    return getPositionData(rpcEndpoint, custodyInfos);
  },
  initialData: keepPreviousData as InitialDataFunction<
    Record<string, PositionAccount>
  >,
  refetchInterval: 60 * 1 * 1000,
  queryKeyHashFn: (queryKey) => {
    const key = queryKey[0];
    const { rpcEndpoint, custodyInfos } = queryKey[1] as {
      rpcEndpoint: string;
      custodyInfos?: Record<string, CustodyAccount>;
    };
    return `${key}-${rpcEndpoint}-${Object.keys(custodyInfos || {}).join(",")}`;
  },
});

const usePositions = ({
  owner = false,
}: {
  owner?: PublicKey | null | false;
}) => {
  const { rpcEndpoint } = useAppConfig();
  const { data: custodyInfos } = useCustodies();
  return usePositionsQuery({
    variables: { rpcEndpoint, custodyInfos },
    select: (positions): Record<string, PositionAccount> => {
      if (owner === false) return positions;
      if (!owner) return {};
      return Object.entries(positions).reduce(
        (positions, [address, data]) => {
          if (owner) {
            const ownerIsUser = data.owner.toBase58() === owner?.toBase58();
            if (ownerIsUser) positions[address] = data;
          }
          return positions;
        },
        {} as Record<string, PositionAccount>,
      );
    },
  });
};

export { usePositionsQuery, usePositions };
