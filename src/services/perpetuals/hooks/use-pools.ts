import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";

import { useCustodies } from "./use-custodies";
import { getPoolData } from "../fetchers/fetch-pools";
import type { CustodyAccount } from "../lib/custody-account";

const usePoolsQuery = createQuery({
  queryKey: ["pools"],
  fetcher: ({
    rpcEndpoint,
    custodyInfos,
  }: {
    rpcEndpoint: string;
    custodyInfos?: Record<string, CustodyAccount>;
  }) => {
    if (!custodyInfos) return null;
    return getPoolData(rpcEndpoint, custodyInfos);
  },
  staleTime: 0,
  gcTime: 0,
});

const usePools = () => {
  const { rpcEndpoint } = useAppConfig();
  const { data: custodyInfos } = useCustodies();
  return usePoolsQuery({
    variables: { rpcEndpoint, custodyInfos },
    enabled: !!custodyInfos,
  });
};

export { usePoolsQuery, usePools };
