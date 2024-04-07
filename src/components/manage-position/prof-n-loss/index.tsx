"use client";
import type { FC } from "react";

import { getTokenSymbol } from "@4x.pro/app-config";
import { useCustodies } from "@4x.pro/services/perpetuals/hooks/use-custodies";
import { usePnLStats } from "@4x.pro/services/perpetuals/hooks/use-pnl-stats";
import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { formatCurrency, formatPercentage } from "@4x.pro/shared/utils/number";
import { Icon } from "@4x.pro/ui-kit/icon";

import { mkProfNLossStyles } from "./styles";

type Props = {
  position: PositionAccount;
};

const ProfNLoss: FC<Props> = ({ position }) => {
  const { data: custodies } = useCustodies();
  const custody = custodies?.[position.token];
  const { data: pnl } = usePnLStats({ position });
  const collateralToken = position.token;
  const collateral =
    custody && position.collateralAmount.toNumber() / custody.decimals;
  const pnlPercentage = pnl && collateral && pnl / collateral;
  const isPositive = typeof pnlPercentage === "number" && pnlPercentage > 0;
  const profNLossStyles = mkProfNLossStyles({ isPositive });
  return (
    <div className={profNLossStyles.root}>
      <span className={profNLossStyles.item}>
        <Icon className={profNLossStyles.icon} src="/icons/trend-up.svg" />
        <span className="uppercase">{position.side.toString()}</span>
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
