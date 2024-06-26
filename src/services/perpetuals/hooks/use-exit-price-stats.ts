import { keepPreviousData } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";

import type { PositionAccount } from "../lib/position-account";
import { getPerpetualProgramAndProvider } from "../utils/constants";
import { ViewHelper } from "../utils/view-helpers";

const useExitPriceStatsQuery = createQuery({
  queryKey: ["exit-price-stats"],
  fetcher: async ({
    rpcEndpoint,
    position,
  }: {
    rpcEndpoint: string;
    position: PositionAccount;
  }) => {
    const { provider } = getPerpetualProgramAndProvider(rpcEndpoint);
    const viewHelper = new ViewHelper(provider.connection, provider);
    return viewHelper.getExitPriceAndFee(position);
  },
  placeholderData: keepPreviousData,
  refetchInterval: 30 * 1000,
  queryKeyHashFn: (queryKey) => {
    const key = queryKey[0] as string;
    const variables = queryKey[1] as {
      rpcEndpoint: string;
      position: PositionAccount;
    };
    return `${key}-${variables.rpcEndpoint}-${variables.position.address}`;
  },
});

const useExitPriceStats = ({ position }: { position: PositionAccount }) => {
  const { rpcEndpoint } = useAppConfig();
  return useExitPriceStatsQuery({
    variables: { rpcEndpoint, position },
    select: (data) => {
      return (
        data && {
          exitPrice: Number(data.price) / 10 ** 6,
          fee: Number(data.fee) / 10 ** 9,
        }
      );
    },
  });
};

export { useExitPriceStats, useExitPriceStatsQuery };
