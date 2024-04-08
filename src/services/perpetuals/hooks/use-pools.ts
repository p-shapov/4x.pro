import type { InitialDataFunction } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";

import { useCustodies } from "./use-custodies";
import { getPoolData } from "../fetchers/fetch-pools";
import type { CustodyAccount } from "../lib/custody-account";
import type { PoolAccount } from "../lib/pool-account";

const usePoolsQuery = createQuery({
  queryKey: ["pools"],
  fetcher: async ({
    rpcEndpoint,
    custodyInfos,
  }: {
    rpcEndpoint: string;
    custodyInfos?: Record<string, CustodyAccount>;
  }) => {
    if (!custodyInfos) return {};
    return getPoolData(rpcEndpoint, custodyInfos);
  },
  initialData: keepPreviousData as InitialDataFunction<
    Record<string, PoolAccount>
  >,
  queryKeyHashFn: (queryKey) => {
    const key = queryKey[0];
    const { rpcEndpoint, custodyInfos } = queryKey[1] as {
      rpcEndpoint: string;
      custodyInfos?: Record<string, CustodyAccount>;
    };
    return `${key}-${rpcEndpoint}-${Object.keys(custodyInfos || {}).join(",")}`;
  },
});

const usePools = () => {
  const { rpcEndpoint } = useAppConfig();
  const { data: custodyInfos } = useCustodies();
  return usePoolsQuery({
    variables: { rpcEndpoint, custodyInfos },
  });
};

export { usePoolsQuery, usePools };
