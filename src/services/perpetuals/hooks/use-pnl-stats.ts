import { keepPreviousData } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";

import type { PositionAccount } from "../lib/position-account";
import { getPerpetualProgramAndProvider } from "../utils/constants";
import { ViewHelper } from "../utils/view-helpers";

const usePnLStatsQuery = createQuery({
  queryKey: ["pnl-stats"],
  fetcher: async ({
    rpcEndpoint,
    position,
  }: {
    rpcEndpoint: string;
    position: PositionAccount;
  }) => {
    const { provider } = getPerpetualProgramAndProvider(rpcEndpoint);
    const viewHelper = new ViewHelper(provider.connection, provider);
    return viewHelper.getPnl(position);
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

const usePnLStats = ({ position }: { position: PositionAccount }) => {
  const { rpcEndpoint } = useAppConfig();
  return usePnLStatsQuery({
    variables: { rpcEndpoint, position },
    select: (data) => {
      const loss = Number(data?.loss || 0);
      const profit = Number(data?.profit || 0);
      if (loss > 0) return (loss / 10 ** 6) * -1;
      if (profit > 0) return profit / 10 ** 6;
      return 0;
    },
  });
};

export { usePnLStats, usePnLStatsQuery };
