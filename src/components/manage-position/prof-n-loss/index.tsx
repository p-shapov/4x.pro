"use client";
import type { FC } from "react";

import { getTokenSymbol } from "@4x.pro/app-config";
import { useCustody } from "@4x.pro/services/perpetuals/hooks/use-custodies";
import { usePnLStats } from "@4x.pro/services/perpetuals/hooks/use-pnl-stats";
import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import {
  formatCurrency_USD,
  formatPercentage,
} from "@4x.pro/shared/utils/number";
import { Icon } from "@4x.pro/ui-kit/icon";

import { mkProfNLossStyles } from "./styles";

type Props = {
  position: PositionAccount;
};

const ProfNLoss: FC<Props> = ({ position }) => {
  const { data: custody } = useCustody({
    address: position.custody.toBase58(),
  });
  const { data: pnl } = usePnLStats({ position });
  const collateralToken = position.token;
  const side = position.side;
  const entryPrice = position.getPrice();
  const collateral =
    custody && position.collateralAmount.toNumber() / 10 ** custody.decimals;
  const pnlPercentage = pnl && collateral && pnl / (collateral * entryPrice);
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
        {isPositive ? "+" : "-"}
        {formatCurrency_USD(pnl && Math.abs(pnl))} ({isPositive ? "+" : "-"}
        {formatPercentage(pnlPercentage && Math.abs(pnlPercentage))})
      </span>
    </div>
  );
};

export { ProfNLoss };
