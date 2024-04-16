import type { PublicKey } from "@solana/web3.js";
import type { PlaceholderDataFunction } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";

import { getCustodyData } from "../fetchers/fetch-custodies";
import { getPositionData } from "../fetchers/fetch-positions";
import type { PositionAccount } from "../lib/position-account";

const usePositionsQuery = createQuery({
  queryKey: ["positions"],
  fetcher: async ({
    rpcEndpoint,
    owner,
  }: {
    rpcEndpoint: string;
    owner?: PublicKey | null | false;
  }) => {
    if (owner !== false && !owner) return {};
    const custodyInfos = await getCustodyData(rpcEndpoint);
    return getPositionData(rpcEndpoint, custodyInfos, owner || undefined);
  },
  placeholderData: keepPreviousData as PlaceholderDataFunction<
    Record<string, PositionAccount>
  >,
  refetchInterval: 60 * 1 * 1000,
  queryKeyHashFn: (queryKey) => {
    const key = queryKey[0];
    const { rpcEndpoint, owner } = queryKey[1] as {
      rpcEndpoint: string;
      owner?: PublicKey | null | false;
    };
    return `${key}-${rpcEndpoint}-${owner?.toString()}`;
  },
});

const usePositions = ({
  owner = false,
}: {
  owner?: PublicKey | null | false;
}) => {
  const { rpcEndpoint } = useAppConfig();
  return usePositionsQuery({
    variables: { rpcEndpoint, owner },
  });
};

export { usePositionsQuery, usePositions };
