import type { FC } from "react";

import type { Token } from "@4x.pro/configs/token-config";
import { useTokenInfo } from "@4x.pro/shared/hooks/use-token-info";
import { formatCurrency_USD, formatRate } from "@4x.pro/shared/utils/number";
import { Definition } from "@4x.pro/ui-kit/definition";

import { mkTradeStatsStyles } from "./styles";

type Props = {
  side: "long" | "short";
  baseToken: Token;
  quoteToken: Token;
  leverage: number;
};

const TradeStats: FC<Props> = ({ baseToken, quoteToken, leverage }) => {
  const tradeStatsStyles = mkTradeStatsStyles();
  const baseTokenInfo = useTokenInfo(baseToken);
  const { price } = baseTokenInfo.priceData || {};
  return (
    <dl className={tradeStatsStyles.root}>
      <Definition term="Collateral in" content={quoteToken} />
      <Definition term="Leverage" content={formatRate(leverage, 1)} />
      <Definition term="Entry Price" content={formatCurrency_USD(price, 2)} />
      <Definition term="Liq Price" content="-" />
      <Definition term="Exit Price" content="-" />
      <Definition term="Fees" content="-" />
      <Definition term="Margin Fees" content="-" />
      <Definition term="Available Liquidity" content="-" />
    </dl>
  );
};

export { TradeStats };
