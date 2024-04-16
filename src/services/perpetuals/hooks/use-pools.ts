import type { InitialDataFunction } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";

import { getCustodyData } from "../fetchers/fetch-custodies";
import { getPoolsData } from "../fetchers/fetch-pools";
import type { PoolAccount } from "../lib/pool-account";

const usePoolsQuery = createQuery({
  queryKey: ["pools"],
  fetcher: async ({ rpcEndpoint }: { rpcEndpoint: string }) => {
    const custodyInfos = await getCustodyData(rpcEndpoint);
    return getPoolsData(rpcEndpoint, custodyInfos);
  },
  placeholderData: keepPreviousData as InitialDataFunction<
    Record<string, PoolAccount>
  >,
  refetchInterval: 60 * 10 * 1000,
  queryKeyHashFn: (queryKey) => {
    const key = queryKey[0];
    const { rpcEndpoint } = queryKey[1] as {
      rpcEndpoint: string;
    };
    return `${key}-${rpcEndpoint}`;
  },
});

const usePools = () => {
  const { rpcEndpoint } = useAppConfig();
  return usePoolsQuery({
    variables: { rpcEndpoint },
  });
};

export { usePoolsQuery, usePools };
