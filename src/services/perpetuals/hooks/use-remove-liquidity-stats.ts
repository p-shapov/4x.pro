import { keepPreviousData } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";

import type { CustodyAccount } from "../lib/custody-account";
import type { PoolAccount } from "../lib/pool-account";
import { getPerpetualProgramAndProvider } from "../utils/constants";
import { ViewHelper } from "../utils/view-helpers";

const useRemoveLiquidityStatsQuery = createQuery({
  queryKey: ["remove-liquidity-stats"],
  fetcher: async ({
    amount,
    rpcEndpoint,
    pool,
    custody,
  }: {
    amount: number;
    rpcEndpoint: string;
    pool: PoolAccount | null;
    custody: CustodyAccount | null;
  }) => {
    if (!pool || !custody) return null;
    const { provider } = getPerpetualProgramAndProvider(rpcEndpoint);
    const viewHelper = new ViewHelper(provider.connection, provider);
    return viewHelper.getRemoveLiquidityAmountAndFees(amount, pool, custody);
  },
  placeholderData: keepPreviousData,
  refetchInterval: 60 * 0.5 * 1000,
  queryKeyHashFn: (queryKey) => {
    const key = queryKey[0] as [string];
    const variables = queryKey[1] as {
      amount: number;
      rpcEndpoint: string;
      pool: PoolAccount | null;
      custody: CustodyAccount | null;
    };
    return `${key}-${variables.amount}-${variables.rpcEndpoint}-${variables.pool?.address}-${variables.custody?.address}`;
  },
});

const useRemoveLiquidityStats = ({
  amount,
  pool,
  custody,
}: {
  amount: number;
  pool: PoolAccount | null;
  custody: CustodyAccount | null;
}) => {
  const { rpcEndpoint } = useAppConfig();
  return useRemoveLiquidityStatsQuery({
    variables: { amount, rpcEndpoint, pool, custody },
    select: (data) => {
      return (
        data &&
        custody &&
        pool && {
          amount: Number(data.amount) / 10 ** custody.decimals,
          fee: Number(data.fee) / 10 ** 9,
        }
      );
    },
  });
};

export { useRemoveLiquidityStatsQuery, useRemoveLiquidityStats };
