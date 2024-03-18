import type { FC } from "react";

import { formatRate } from "@4x.pro/shared/utils/number";
import { Definition } from "@4x.pro/ui-kit/definition";

import { mkTradeStatsStyles } from "./styles";

type Token = {
  account: string;
  symbol: string;
};

type Props = {
  collateralToken: Token;
  leverage: number;
};

const TradeStats: FC<Props> = ({ collateralToken, leverage }) => {
  const tradeStatsStyles = mkTradeStatsStyles();
  return (
    <dl className={tradeStatsStyles.root}>
      <Definition term="Collateral in" content={collateralToken.symbol} />
      <Definition term="Leverage" content={formatRate(leverage, 1)} />
      <Definition term="Entry Price" content="1.1" />
      <Definition term="Liq Price" content="1.1" />
      <Definition term="Exit Price" content="1.1" />
      <Definition term="Fees" content="0.5" />
      <Definition term="Margin Fees" content="0.5" />
      <Definition term="Available Liquidity" content="0.5" />
    </dl>
  );
};

export { TradeStats };
