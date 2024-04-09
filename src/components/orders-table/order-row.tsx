import cn from "classnames";
import type { FC } from "react";

import { useCustodies } from "@4x.pro/services/perpetuals/hooks/use-custodies";
import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-connection";
import {
  formatCurrency,
  formatCurrency_USD,
  formatRate,
} from "@4x.pro/shared/utils/number";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";

import { mkOrderRowStyles } from "./styles";

type Props = {
  type: "sl" | "tp";
  position: PositionAccount;
};

const OrderRow: FC<Props> = ({ type, position }) => {
  const orderRowStyles = mkOrderRowStyles();
  const { data: custodies } = useCustodies();
  const custody = custodies?.[position.custody.toString()];
  const collateral =
    custody && position.collateralAmount.toNumber() / 10 ** custody.decimals;
  const entryPrice = position.getPrice();
  const collateralToken = position.token;
  const leverage = position.getLeverage();
  const size = collateral && collateral * leverage;
  const { price: marketPrice } =
    useWatchPythPriceFeed(collateralToken).priceData || {};
  const getType = () => {
    if (type === "sl") {
      return "Stop Loss";
    }
    if (type === "tp") {
      return "Take Profit";
    }
    return "";
  };
  return (
    <tr key={position.address.toString()} className={cn(orderRowStyles.root)}>
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
        {type === "sl" &&
          formatCurrency_USD(Number(position.stopLoss) / 10 ** 6, 2)}
        {type === "tp" &&
          formatCurrency_USD(Number(position.takeProfit) / 10 ** 6, 2)}
      </td>
      {/* <td className={orderRowStyles.cell}>
        <div className={cn("flex", "gap-[2rem]")}>
          <Link variant="red" iconSrc="/icons/close-circle.svg"></Link>
        </div>
      </td> */}
    </tr>
  );
};

export { OrderRow };
