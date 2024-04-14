import type { PublicKey } from "@solana/web3.js";
import type { InitialDataFunction } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";

import { useCustodies } from "./use-custodies";
import { getPoolData } from "../fetchers/fetch-pools";
import type { CustodyAccount } from "../lib/custody-account";
import type { PoolAccount } from "../lib/pool-account";

const usePoolQuery = createQuery({
  queryKey: ["pool"],
  fetcher: async ({
    poolPublicKey,
    rpcEndpoint,
    custodyInfos,
  }: {
    poolPublicKey: PublicKey;
    rpcEndpoint: string;
    custodyInfos?: Record<string, CustodyAccount>;
  }) => {
    if (!custodyInfos) return null;
    return getPoolData(rpcEndpoint, poolPublicKey, custodyInfos);
  },
  placeholderData: keepPreviousData as InitialDataFunction<PoolAccount>,
  refetchInterval: 60 * 10 * 1000,
  queryKeyHashFn: (queryKey) => {
    const key = queryKey[0];
    const { rpcEndpoint, custodyInfos } = queryKey[1] as {
      rpcEndpoint: string;
      custodyInfos?: Record<string, CustodyAccount>;
    };
    return `${key}-${rpcEndpoint}-${Object.keys(custodyInfos || {}).join(",")}`;
  },
});

const usePool = ({ address }: { address: PublicKey }) => {
  const { rpcEndpoint } = useAppConfig();
  const { data: custodyInfos } = useCustodies();
  return usePoolQuery({
    variables: { rpcEndpoint, custodyInfos, poolPublicKey: address },
  });
};

export { usePoolQuery, usePool };
