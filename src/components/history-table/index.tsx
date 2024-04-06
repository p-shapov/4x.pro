import cn from "classnames";
import dayjs from "dayjs";
import type { FC } from "react";

import type { Token } from "@4x.pro/app-config";
import { TRX_URL } from "@4x.pro/services/transaction-flow/utils";
import { mkTableStyles } from "@4x.pro/shared/styles/table";
import { formatCurrency_USD } from "@4x.pro/shared/utils/number";
import { trim } from "@4x.pro/shared/utils/string";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";

type Props = {
  items: {
    txid: string;
    token: Token;
    type:
      | "open"
      | "close"
      | "liquidation"
      | "stop"
      | "take-profit"
      | "add-collateral"
      | "remove-collateral";
    time: number;
    side?: "short" | "long";
    pnl?: number;
    price?: number;
    fee?: number;
  }[];
};

const HistoryTable: FC<Props> = ({ items }) => {
  const tableStyles = mkTableStyles();
  const getType = (type: string) => {
    switch (type) {
      case "open":
        return "Open";
      case "close":
        return "Close";
      case "liquidation":
        return "Liquidation";
      case "stop":
        return "Stop";
      case "take-profit":
        return "Take Profit";
      case "add-collateral":
        return "Add Collateral";
      case "remove-collateral":
        return "Remove Collateral";
      default:
        return "Unknown";
    }
  };
  return (
    <table
      className={tableStyles.root}
      style={{
        // @ts-expect-error - CSS variable
        "--tw-table-cols": 8,
      }}
    >
      <thead className={cn(tableStyles.head, "pl-[2.4rem]")}>
        <tr className={tableStyles.row}>
          <th className={tableStyles.headingCell}>Market</th>
          <th className={tableStyles.headingCell}>Type</th>
          <th className={tableStyles.headingCell}>Side</th>
          <th className={tableStyles.headingCell}>PnL</th>
          <th className={tableStyles.headingCell}>Price</th>
          <th className={tableStyles.headingCell}>Fee</th>
          <th className={tableStyles.headingCell}>Time</th>
          <th className={tableStyles.headingCell}>Trx</th>
        </tr>
      </thead>
      <tbody className={tableStyles.body}>
        {items.map((item) => (
          <tr
            key={item.txid}
            className={cn(tableStyles.row, tableStyles.rowDelimiter)}
          >
            <td className={tableStyles.cell}>
              <TokenBadge token={item.token} showNetwork gap={8} />
            </td>
            <td className={tableStyles.cell}>{getType(item.type)}</td>
            <td className={tableStyles.cell}>
              <span className="capitalize">{item.side}</span>
            </td>
            <td className={tableStyles.cell}>{formatCurrency_USD(item.pnl)}</td>
            <td className={tableStyles.cell}>
              {formatCurrency_USD(item.price)}
            </td>
            <td className={tableStyles.cell}>{formatCurrency_USD(item.fee)}</td>
            <td className={tableStyles.cell}>
              <span>{dayjs(item.time).utc(false).format("DD-MM-YYYY")}</span>
              <span className="text-body-12 text-content-2">
                {dayjs(item.time).utc(false).format("HH:mm A")}
              </span>
            </td>
            <td className={tableStyles.cell}>
              <a
                href={TRX_URL(item.txid)}
                target="_blank"
                rel="noreferrer noopener"
                className="link"
              >
                {trim(item.txid, 5)}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { HistoryTable };
