"use client";
import cn from "classnames";
import { useState } from "react";
import type { FC } from "react";

import { useCustodies } from "@4x.pro/services/perpetuals/hooks/use-custodies";
import { useLiquidationPriceStats } from "@4x.pro/services/perpetuals/hooks/use-liquidation-price-stats";
import { usePnLStats } from "@4x.pro/services/perpetuals/hooks/use-pnl-stats";
import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { Side } from "@4x.pro/services/perpetuals/lib/types";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-connection";
import {
  formatCurrency_USD,
  formatCurrency,
  formatPercentage,
  formatRate,
} from "@4x.pro/shared/utils/number";
import { Link } from "@4x.pro/ui-kit/link";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";

import { mkPositionRowStyles } from "./styles";
import { ClosePosition } from "../close-position";
import { ManagePosition } from "../manage-position";

type Props = {
  position: PositionAccount;
};

const PositionRow: FC<Props> = ({ position }) => {
  const { data: custodies } = useCustodies();
  const custody = custodies?.[position.custody.toString()];
  const collateral =
    custody && position.collateralAmount.toNumber() / 10 ** custody.decimals;
  const entryPrice = position.getPrice();
  const collateralToken = position.token;
  const leverage = position.getLeverage();
  const side = position.side === Side.Long ? "long" : "short";
  const [openManagePosition, setOpenManagePosition] = useState(false);
  const [openClosePosition, setOpenClosePosition] = useState(false);
  const size = collateral && collateral * leverage;
  const { price: marketPrice } =
    useWatchPythPriceFeed(collateralToken).priceData || {};
  const pnl = usePnLStats({ position });
  const pnlPercentage =
    pnl.data && collateral && pnl.data / (collateral * entryPrice);
  const liquidationPrice = useLiquidationPriceStats({ position });
  const isPositive = typeof pnlPercentage === "number" && pnlPercentage > 0;
  const positionRowStyles = mkPositionRowStyles({ isPositive });
  const handleOpenManagePosition = () => {
    setOpenManagePosition(true);
  };
  const handleCloseManagePosition = () => {
    setOpenManagePosition(false);
  };
  const handleOpenClosePosition = () => {
    setOpenClosePosition(true);
  };
  const handleCloseClosePosition = () => {
    setOpenClosePosition(false);
  };
  return (
    <tr className={positionRowStyles.root}>
      <td className={positionRowStyles.cell}>
        <TokenBadge token={collateralToken} showNetwork gap={8} />
      </td>
      <td className={positionRowStyles.cell}>
        <span>
          <span className="capitalize">{side}</span>{" "}
          <span className={positionRowStyles.secondaryText}>
            ({formatRate(leverage)})
          </span>
        </span>
      </td>
      <td className={positionRowStyles.cell}>
        {formatCurrency_USD(size && size * entryPrice)}
        <span className={positionRowStyles.secondaryText}>
          ({formatCurrency(collateralToken)(size)})
        </span>
      </td>
      <td className={positionRowStyles.cell}>
        {formatCurrency_USD(collateral && collateral * entryPrice)}
        <span className={positionRowStyles.secondaryText}>
          ({formatCurrency(collateralToken)(collateral)})
        </span>
      </td>
      <td className={cn(positionRowStyles.cell, positionRowStyles.pnl)}>
        {pnl.data ? (
          <>
            <span>
              {isPositive ? "+" : "-"}
              {formatCurrency_USD(pnl.data && Math.abs(pnl.data))}
            </span>
            <span>
              ({isPositive ? "+" : "-"}
              {formatPercentage(pnlPercentage && Math.abs(pnlPercentage))})
            </span>
          </>
        ) : (
          "-"
        )}
      </td>
      <td className={positionRowStyles.cell}>
        {formatCurrency_USD(entryPrice)}
      </td>
      <td className={positionRowStyles.cell}>
        {formatCurrency_USD(marketPrice)}
      </td>
      <td className={cn(positionRowStyles.cell)}>
        {formatCurrency_USD(liquidationPrice.data)}
      </td>
      <td className={positionRowStyles.cell}>
        <span className={cn("flex", "gap-[2rem]")}>
          <ManagePosition
            open={openManagePosition}
            onClose={handleCloseManagePosition}
            position={position}
          />
          <Link
            variant="accent"
            iconSrc="/icons/setting-2.svg"
            onClick={handleOpenManagePosition}
          ></Link>
          <ClosePosition
            open={openClosePosition}
            onClose={handleCloseClosePosition}
            position={position}
          />
          <Link
            variant="red"
            iconSrc="/icons/close-circle.svg"
            onClick={handleOpenClosePosition}
          ></Link>
        </span>
      </td>
    </tr>
  );
};

export { PositionRow };
