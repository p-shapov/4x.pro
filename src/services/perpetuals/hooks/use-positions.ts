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
    owner,
  }: {
    rpcEndpoint: string;
    custodyInfos?: Record<string, CustodyAccount>;
    owner?: PublicKey | null | false;
  }) => {
    if (owner !== false && !owner) return {};
    if (!custodyInfos) return {};
    return getPositionData(rpcEndpoint, custodyInfos, owner || undefined);
  },
  placeholderData: keepPreviousData as InitialDataFunction<
    Record<string, PositionAccount>
  >,
  refetchInterval: 60 * 1 * 1000,
  queryKeyHashFn: (queryKey) => {
    const key = queryKey[0];
    const { rpcEndpoint, custodyInfos, owner } = queryKey[1] as {
      rpcEndpoint: string;
      custodyInfos?: Record<string, CustodyAccount>;
      owner?: PublicKey | null | false;
    };
    return `${key}-${rpcEndpoint}-${Object.keys(custodyInfos || {}).join(
      ",",
    )}-${owner?.toString()}`;
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
    variables: { rpcEndpoint, custodyInfos, owner },
  });
};

export { usePositionsQuery, usePositions };
