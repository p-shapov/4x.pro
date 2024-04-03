import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";

import { getCustodyData } from "../fetchers/fetch-custodies";

const useCustodiesQuery = createQuery({
  queryKey: ["custodies"],
  fetcher: ({ rpcEndpoint }: { rpcEndpoint: string }) => {
    return getCustodyData(rpcEndpoint);
  },
  staleTime: 0,
  gcTime: 0,
});

const useCustodies = () => {
  const { rpcEndpoint } = useAppConfig();
  return useCustodiesQuery({ variables: { rpcEndpoint } });
};

export { useCustodiesQuery, useCustodies };
