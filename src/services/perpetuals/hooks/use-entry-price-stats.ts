import { keepPreviousData } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";

import { usePools } from "./use-pools";
import type { CustodyAccount } from "../lib/custody-account";
import type { PoolAccount } from "../lib/pool-account";
import type { Side } from "../lib/types";
import { getPerpetualProgramAndProvider } from "../utils/constants";
import { ViewHelper } from "../utils/view-helpers";

const useEntryPriceStatsQuery = createQuery({
  queryKey: ["entry-price-stats"],
  fetcher: async ({
    rpcEndpoint,
    collateral,
    size,
    side,
    pool,
    custody,
  }: {
    collateral: number;
    size: number;
    side: Side;
    rpcEndpoint: string;
    pool: PoolAccount | null;
    custody: CustodyAccount | null;
  }) => {
    if (!pool || !custody) return null;
    const { provider } = getPerpetualProgramAndProvider(rpcEndpoint);
    const viewHelper = new ViewHelper(provider.connection, provider);
    return viewHelper.getEntryPriceAndFee(
      collateral,
      size,
      side,
      pool,
      custody,
    );
  },
  placeholderData: keepPreviousData,
  staleTime: 0,
  gcTime: 0,
  queryKeyHashFn: (queryKey) => {
    const key = queryKey[0] as [string];
    const variables = queryKey[1] as {
      rpcEndpoint: string;
      collateral: number;
      size: number;
      side: Side;
      pool: PoolAccount | null;
      custody: CustodyAccount | null;
    };
    return `${key}-${variables.rpcEndpoint}-${variables.collateral}-${variables.size}-${variables.side}-${variables.pool?.address}-${variables.custody?.address}`;
  },
});

const useEntryPriceStats = ({
  collateralToken,
  collateral,
  size,
  side,
}: {
  collateralToken: Token;
  collateral: number;
  size: number;
  side: Side;
}) => {
  const { rpcEndpoint } = useAppConfig();
  const pools = usePools();
  const pool = Object.values(pools.data || {})[0] || null;
  const custody = pool?.getCustodyAccount(collateralToken) || null;
  return useEntryPriceStatsQuery({
    variables: {
      rpcEndpoint,
      collateral,
      size,
      side,
      custody,
      pool,
    },
    select: (data) => {
      return (
        data && {
          liquidationPrice: data.liquidationPrice.toNumber() / 10 ** 6,
          entryPrice: data.entryPrice.toNumber() / 10 ** 6,
          fee: data.fee.toNumber() / 10 ** 9,
        }
      );
    },
  });
};

export { useEntryPriceStatsQuery, useEntryPriceStats };
