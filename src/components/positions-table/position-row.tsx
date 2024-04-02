"use client";
import cn from "classnames";
import { useState } from "react";
import type { FC } from "react";

import type { Token } from "@4x.pro/configs/dex-platform";
import { useDexPlatformConfig } from "@4x.pro/configs/dex-platform";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-price-feed";
import {
  calculateLiquidationPrice,
  calculatePnL,
  calculatePnLPercentage,
  formatCurrency_USD,
  formatCurrency,
  formatPercentage,
  formatRate,
} from "@4x.pro/shared/utils/number";
import { Link } from "@4x.pro/ui-kit/link";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";

import { mkPositionRowStyles } from "./styles";
import { ManagePosition } from "../manage-position";

type Props = {
  id: string;
  collateralToken: Token;
  side: "short" | "long";
  leverage: number;
  collateral: number;
  entryPrice: number;
};

const PositionRow: FC<Props> = ({
  collateralToken,
  side,
  leverage,
  collateral,
  entryPrice,
}) => {
  const [openManagePosition, setOpenManagePosition] = useState(false);
  const size = collateral * leverage;
  const pythConnection = useDexPlatformConfig((state) => state.pythConnection);
  const { price: marketPrice } =
    useWatchPythPriceFeed(pythConnection)(collateralToken).priceData || {};
  const pnl =
    marketPrice && calculatePnL(entryPrice, marketPrice, size, side === "long");
  const pnlPercentage =
    marketPrice &&
    calculatePnLPercentage(entryPrice, marketPrice, size, side === "long");
  const liquidationPrice = calculateLiquidationPrice(
    entryPrice,
    leverage,
    0.1,
    side === "long",
  );
  const isPositive = typeof pnlPercentage === "number" && pnlPercentage > 0;
  const positionRowStyles = mkPositionRowStyles({ isPositive });
  const handleOpenManagePosition = () => {
    setOpenManagePosition(true);
  };
  const handleCloseManagePosition = () => {
    setOpenManagePosition(false);
  };
  return (
    <>
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
          {formatCurrency_USD(size * entryPrice)}
          <span className={positionRowStyles.secondaryText}>
            ({formatCurrency(collateralToken)(size)})
          </span>
        </td>
        <td className={positionRowStyles.cell}>
          {formatCurrency_USD(collateral * entryPrice)}
          <span className={positionRowStyles.secondaryText}>
            ({formatCurrency(collateralToken)(collateral)})
          </span>
        </td>
        <td className={cn(positionRowStyles.cell, positionRowStyles.pnl)}>
          <span>
            {isPositive ? "+" : "-"}
            {formatCurrency_USD(pnl && Math.abs(pnl))}
          </span>
          <span>
            ({isPositive ? "+" : "-"}
            {formatPercentage(pnlPercentage && Math.abs(pnlPercentage))})
          </span>
        </td>
        <td className={positionRowStyles.cell}>
          {formatCurrency_USD(entryPrice)}
        </td>
        <td className={positionRowStyles.cell}>
          {formatCurrency_USD(marketPrice)}
        </td>
        <td className={positionRowStyles.cell}>
          {formatCurrency_USD(liquidationPrice)}
        </td>
        <td className={positionRowStyles.cell}>
          <span className={cn("flex", "gap-[2rem]")}>
            <ManagePosition
              open={openManagePosition}
              onClose={handleCloseManagePosition}
              collateral={collateral}
              collateralToken={collateralToken}
              entryPrice={entryPrice}
              leverage={leverage}
              side={side}
            />
            <Link
              variant="accent"
              iconSrc="/icons/setting-2.svg"
              onClick={handleOpenManagePosition}
            ></Link>
            <Link variant="red" iconSrc="/icons/close-circle.svg"></Link>
          </span>
        </td>
      </tr>
    </>
  );
};

export { PositionRow };
