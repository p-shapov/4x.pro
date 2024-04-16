import cn from "classnames";
import { useState } from "react";
import type { FC } from "react";

import { queryClient } from "@4x.pro/app-config";
import { useCustody } from "@4x.pro/services/perpetuals/hooks/use-custodies";
import { usePositionsQuery } from "@4x.pro/services/perpetuals/hooks/use-positions";
import { useWatchPosition } from "@4x.pro/services/perpetuals/hooks/use-watch-position";
import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import type { OrderTxType } from "@4x.pro/services/perpetuals/lib/types";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-connection";
import {
  formatCurrency,
  formatCurrency_USD,
  formatRate,
} from "@4x.pro/shared/utils/number";
import { Link } from "@4x.pro/ui-kit/link";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";

import { CancelOrderDialog } from "./cancel-order-dialog";
import { EditOrderDialog } from "./edit-order-dialog";
import { mkOrderRowStyles } from "./styles";

type Props = {
  type: OrderTxType;
  position: PositionAccount;
};

const OrderRow: FC<Props> = ({ type, position }) => {
  const [openManageOrderDialog, setOpenManageOrderDialog] = useState(false);
  const [openCancelOrderDialog, setOpenCancelOrderDialog] = useState(false);
  const orderRowStyles = mkOrderRowStyles();
  const { data: custody } = useCustody({
    address: position.custody.toBase58(),
  });
  const collateral =
    custody && position.collateralAmount.toNumber() / 10 ** custody.decimals;
  const entryPrice = position.getPrice();
  const collateralToken = position.token;
  const leverage = position.getLeverage();
  const size = collateral && collateral * leverage;
  const { price: marketPrice } =
    useWatchPythPriceFeed(collateralToken).priceData || {};
  useWatchPosition({
    position,
    listener: () =>
      queryClient.invalidateQueries({
        queryKey: usePositionsQuery.getKey(),
      }),
  });
  const getType = () => {
    switch (type) {
      case "stop-loss":
        return "Stop Loss";
      case "take-profit":
        return "Take Profit";
    }
  };
  const getTriggerPrice = () => {
    switch (type) {
      case "stop-loss":
        return position.getStopLoss()!;
      case "take-profit":
        return position.getTakeProfit()!;
    }
  };
  const handleOpenManageOrderDialog = () => {
    setOpenManageOrderDialog(true);
  };
  const handleCloseManageOrderDialog = () => {
    setOpenManageOrderDialog(false);
  };
  const handleOpenCancelOrderDialog = () => {
    setOpenCancelOrderDialog(true);
  };
  const handleCloseCancelOrderDialog = () => {
    setOpenCancelOrderDialog(false);
  };
  return (
    <tr className={cn(orderRowStyles.root)}>
      <td className={orderRowStyles.cell}>
        <TokenBadge token={position.token} showNetwork gap={8} />
      </td>
      <td className={orderRowStyles.cell}>
        <span className="capitalize">{position.side}</span>{" "}
        <span className="text-content-2">
          ({formatRate(position.getLeverage())})
        </span>
      </td>
      <td className={orderRowStyles.cell}>
        {formatCurrency_USD(size && size * entryPrice)}
        <span className={orderRowStyles.secondaryText}>
          ({formatCurrency(collateralToken)(size)})
        </span>
      </td>
      <td className={orderRowStyles.cell}>{getType()}</td>
      <td className={orderRowStyles.cell}>
        {formatCurrency_USD(marketPrice, 2)}
      </td>
      <td className={orderRowStyles.cell}>
        {formatCurrency_USD(getTriggerPrice(), 2)}
      </td>
      <td className={orderRowStyles.cell}>
        <div className={cn("flex", "gap-[2rem]")}>
          <EditOrderDialog
            type={type}
            open={openManageOrderDialog}
            position={position}
            onClose={handleCloseManageOrderDialog}
          />
          <Link
            variant="accent"
            iconSrc="/icons/edit-2.svg"
            onClick={handleOpenManageOrderDialog}
          ></Link>
          <CancelOrderDialog
            position={position}
            type={type}
            open={openCancelOrderDialog}
            onClose={handleCloseCancelOrderDialog}
          />
          <Link
            variant="red"
            iconSrc="/icons/close-circle.svg"
            onClick={handleOpenCancelOrderDialog}
          ></Link>
        </div>
      </td>
    </tr>
  );
};

export { OrderRow };
