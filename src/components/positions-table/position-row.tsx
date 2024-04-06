"use client";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import cn from "classnames";
import { useState } from "react";
import type { FC } from "react";

import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { Side } from "@4x.pro/services/perpetuals/lib/types";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-connection";
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
  position: PositionAccount;
};

const PositionRow: FC<Props> = ({ position }) => {
  const collateral = position.collateralAmount.toNumber() / LAMPORTS_PER_SOL;
  const entryPrice = position.getPrice();
  const collateralToken = position.token;
  const leverage = position.getLeverage();
  const side = position.side === Side.Long ? "long" : "short";
  const [openManagePosition, setOpenManagePosition] = useState(false);
  const size = collateral * leverage;
  const { price: marketPrice } =
    useWatchPythPriceFeed(collateralToken).priceData || {};
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
              position={position}
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
