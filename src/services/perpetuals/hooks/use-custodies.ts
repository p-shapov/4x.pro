import type { InitialDataFunction } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";

import { getCustodyData } from "../fetchers/fetch-custodies";
import type { CustodyAccount } from "../lib/custody-account";

const useCustodiesQuery = createQuery({
  queryKey: ["custodies"],
  fetcher: async ({ rpcEndpoint }: { rpcEndpoint: string }) => {
    return (await getCustodyData(rpcEndpoint)) || {};
  },
  refetchInterval: 60 * 10 * 1000,
  placeholderData: keepPreviousData as InitialDataFunction<
    Record<string, CustodyAccount>
  >,
});

const useCustodies = () => {
  const { rpcEndpoint } = useAppConfig();
  return useCustodiesQuery({ variables: { rpcEndpoint } });
};

export { useCustodiesQuery, useCustodies };
