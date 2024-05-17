import { keepPreviousData } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";

import type { CustodyAccount } from "../lib/custody-account";
import type { PoolAccount } from "../lib/pool-account";
import type { PositionSide } from "../lib/types";
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
    side: PositionSide;
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
  refetchInterval: 60 * 1 * 1000,
  queryKeyHashFn: (queryKey) => {
    const key = queryKey[0] as [string];
    const variables = queryKey[1] as {
      rpcEndpoint: string;
      collateral: number;
      size: number;
      side: PositionSide;
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
  pool,
}: {
  collateralToken: Token;
  collateral: number;
  size: number;
  side: PositionSide;
  pool: PoolAccount | null;
}) => {
  const { rpcEndpoint } = useAppConfig();
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
          fee: data.fee.toNumber() / 10 ** custody!.decimals,
        }
      );
    },
  });
};

export { useEntryPriceStatsQuery, useEntryPriceStats };
