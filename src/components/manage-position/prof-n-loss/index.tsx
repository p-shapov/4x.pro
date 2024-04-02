"use client";
import type { FC } from "react";

import type { Token } from "@4x.pro/app-config";
import { getTokenSymbol } from "@4x.pro/app-config";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-connection";
import {
  calculatePnL,
  calculatePnLPercentage,
  formatCurrency,
  formatPercentage,
} from "@4x.pro/shared/utils/number";
import { Icon } from "@4x.pro/ui-kit/icon";

import { mkProfNLossStyles } from "./styles";

type Props = {
  side: "long" | "short";
  size: number;
  collateralToken: Token;
  entryPrice: number;
};

const ProfNLoss: FC<Props> = ({ side, size, collateralToken, entryPrice }) => {
  const { price: marketPrice } =
    useWatchPythPriceFeed(collateralToken).priceData || {};
  const pnl =
    marketPrice && calculatePnL(entryPrice, marketPrice, size, side === "long");
  const pnlPercentage =
    marketPrice &&
    calculatePnLPercentage(entryPrice, marketPrice, size, side === "long");
  const isPositive = typeof pnlPercentage === "number" && pnlPercentage > 0;
  const profNLossStyles = mkProfNLossStyles({ isPositive });
  return (
    <div className={profNLossStyles.root}>
      <span className={profNLossStyles.item}>
        <Icon className={profNLossStyles.icon} src="/icons/trend-up.svg" />
        <span className="uppercase">{side}</span>
      </span>
      <span className={profNLossStyles.item}>
        {getTokenSymbol(collateralToken)} / PnL
      </span>
      <span className={profNLossStyles.item}>
        {pnlPercentage && (
          <Icon
            className={profNLossStyles.icon}
            src={
              pnlPercentage > 0
                ? "/icons/arrow-up.svg"
                : "/icons/arrow-down.svg"
            }
          />
        )}
        {formatCurrency("$")(pnl)}
        {isPositive ? "+" : "-"}({formatPercentage(pnlPercentage)})
      </span>
    </div>
  );
};

export { ProfNLoss };
