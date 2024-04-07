import { keepPreviousData } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

import { useAppConfig } from "@4x.pro/app-config";

import { useCustodies } from "./use-custodies";
import type { CustodyAccount } from "../lib/custody-account";
import type { PositionAccount } from "../lib/position-account";
import { getPerpetualProgramAndProvider } from "../utils/constants";
import { ViewHelper } from "../utils/view-helpers";

const useLiquidationPriceStatsQuery = createQuery({
  queryKey: ["liquidation-price-stats"],
  fetcher: async ({
    rpcEndpoint,
    withdrawalAmount,
    depositAmount,
    position,
    custody,
  }: {
    rpcEndpoint: string;
    withdrawalAmount?: number;
    depositAmount?: number;
    position: PositionAccount;
    custody: CustodyAccount | null;
  }) => {
    if (!custody) return null;
    const { provider } = getPerpetualProgramAndProvider(rpcEndpoint);
    const viewHelper = new ViewHelper(provider.connection, provider);
    return viewHelper.getLiquidationPrice(
      position,
      custody,
      depositAmount,
      withdrawalAmount,
    );
  },
  refetchInterval: 30 * 1000,
  placeholderData: keepPreviousData,
  queryKeyHashFn: (queryKey) => {
    const key = queryKey[0] as string;
    const variables = queryKey[1] as {
      rpcEndpoint: string;
      withdrawalAmount?: number;
      depositAmount?: number;
      position: PositionAccount;
      custody: CustodyAccount | null;
    };
    return `${key}-${variables.rpcEndpoint}-${variables.position.address}-${variables.custody?.address}-${variables.withdrawalAmount}-${variables.depositAmount}`;
  },
});

const useLiquidationPriceStats = ({
  position,
  withdrawalAmount,
  depositAmount,
}: {
  position: PositionAccount;
  withdrawalAmount?: number;
  depositAmount?: number;
}) => {
  const { rpcEndpoint } = useAppConfig();
  const custody = useCustodies().data?.[position.custody.toString()] || null;
  return useLiquidationPriceStatsQuery({
    variables: {
      rpcEndpoint,
      withdrawalAmount,
      depositAmount,
      position,
      custody,
    },
    select: (data) => {
      return Number(data || 0) / 10 ** 6;
    },
  });
};

export { useLiquidationPriceStats, useLiquidationPriceStatsQuery };
