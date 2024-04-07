import { useDeferredValue } from "react";
import type { FC } from "react";

import type { Token } from "@4x.pro/app-config";
import { useEntryPriceStats } from "@4x.pro/services/perpetuals/hooks/use-entry-price-stats";
import { usePools } from "@4x.pro/services/perpetuals/hooks/use-pools";
import { usePriceStats } from "@4x.pro/services/perpetuals/hooks/use-price-stats";
import { Side } from "@4x.pro/services/perpetuals/lib/types";
import { formatCurrency_USD, formatRate } from "@4x.pro/shared/utils/number";
import { Definition } from "@4x.pro/ui-kit/definition";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";

import { mkTradeStatsStyles } from "./styles";

type Props = {
  side: "long" | "short";
  collateralToken: Token;
  collateral: number;
  leverage: number;
};

const TradeStats: FC<Props> = ({
  side,
  collateral,
  collateralToken,
  leverage,
}) => {
  const { data: poolsData } = usePools();
  const pool = poolsData && Object.values(poolsData)[0];
  const { data: priceStats } = usePriceStats();
  const tradeStatsStyles = mkTradeStatsStyles();
  const size = collateral * leverage;
  const { data: statsData } = useEntryPriceStats({
    collateralToken,
    collateral: useDeferredValue(collateral),
    size: useDeferredValue(size),
    side: side === "long" ? Side.Long : Side.Short,
  });
  return (
    <dl className={tradeStatsStyles.root}>
      <Definition
        term="Collateral in"
        content={<TokenBadge token={collateralToken} />}
      />
      <Definition term="Leverage" content={formatRate(leverage, 1)} />
      <Definition
        term="Entry Price"
        content={formatCurrency_USD(statsData?.entryPrice)}
      />
      <Definition
        term="Liq. Price"
        content={formatCurrency_USD(statsData?.liquidationPrice)}
      />
      <Definition term="Fees" content={formatCurrency_USD(statsData?.fee)} />
      <Definition
        term="Available Liquidity"
        content={formatCurrency_USD(
          priceStats &&
            pool
              ?.getCustodyAccount(collateralToken)
              ?.getCustodyLiquidity(priceStats),
        )}
      />
    </dl>
  );
};

export { TradeStats };
