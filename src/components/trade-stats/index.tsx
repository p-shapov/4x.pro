import { useCallback } from "react";
import type { FC } from "react";

import type { Token } from "@4x.pro/configs/token-config";
import {
  calculateLiquidationPrice,
  formatRate,
} from "@4x.pro/shared/utils/number";
import { Definition } from "@4x.pro/ui-kit/definition";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";
import { TokenPrice } from "@4x.pro/ui-kit/token-price";

import { mkTradeStatsStyles } from "./styles";

type Props = {
  side: "long" | "short";
  collateral: Token;
  leverage: number;
};

const TradeStats: FC<Props> = ({ side, collateral, leverage }) => {
  const tradeStatsStyles = mkTradeStatsStyles();
  return (
    <dl className={tradeStatsStyles.root}>
      <Definition
        term="Collateral in"
        content={<TokenBadge token={collateral} />}
      />
      <Definition term="Leverage" content={formatRate(leverage, 1)} />
      <Definition
        term="Entry Price"
        content={<TokenPrice token={collateral} fractionalDigits={2} />}
      />
      <Definition
        term="Liq. Price"
        content={
          <TokenPrice token={collateral} fractionalDigits={2}>
            {useCallback(
              (price?: number) =>
                price &&
                calculateLiquidationPrice(
                  price,
                  leverage,
                  0.1,
                  side === "long",
                ),
              [leverage, side],
            )}
          </TokenPrice>
        }
      />
      <Definition term="Exit Price" content="-" />
      <Definition term="Fees" content="-" />
      <Definition term="Margin Fees" content="-" />
      <Definition term="Available Liquidity" content="-" />
    </dl>
  );
};

export { TradeStats };
