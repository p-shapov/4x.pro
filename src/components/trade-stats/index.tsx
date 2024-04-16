import { useDeferredValue } from "react";
import type { FC } from "react";

import type { Token } from "@4x.pro/app-config";
import { useEntryPriceStats } from "@4x.pro/services/perpetuals/hooks/use-entry-price-stats";
import type { PoolAccount } from "@4x.pro/services/perpetuals/lib/pool-account";
import type { PositionSide } from "@4x.pro/services/perpetuals/lib/types";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-connection";
import { formatCurrency_USD, formatRate } from "@4x.pro/shared/utils/number";
import { Definition } from "@4x.pro/ui-kit/definition";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";

import { mkTradeStatsStyles } from "./styles";

type Props = {
  pool: PoolAccount;
  side: PositionSide;
  collateralToken: Token;
  collateral: number;
  leverage: number;
};

const TradeStats: FC<Props> = ({
  pool,
  side,
  collateral,
  collateralToken,
  leverage,
}) => {
  const tradeStatsStyles = mkTradeStatsStyles();
  const size = collateral * leverage;
  const { priceData } = useWatchPythPriceFeed(collateralToken) || {};
  const { data: statsData } = useEntryPriceStats({
    pool,
    side,
    collateralToken,
    collateral: useDeferredValue(collateral),
    size: useDeferredValue(size),
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
          priceData?.price &&
            pool
              ?.getCustodyAccount(collateralToken)
              ?.getCustodyLiquidity(priceData.price),
        )}
      />
    </dl>
  );
};

export { TradeStats };
