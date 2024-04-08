import type { PublicKey } from "@solana/web3.js";
import cn from "classnames";
import dayjs from "dayjs";
import type { FC, ReactNode } from "react";

import { useTradingHistory } from "@4x.pro/services/trading-history/hooks/use-trading-history";
import { TRX_URL } from "@4x.pro/services/transaction-flow/utils";
import { mkTableStyles } from "@4x.pro/shared/styles/table";
import {
  formatCurrency,
  formatCurrency_USD,
  formatPercentage,
  formatRate,
} from "@4x.pro/shared/utils/number";
import { trim } from "@4x.pro/shared/utils/string";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";

type Props = {
  owner?: PublicKey | null;
  fallback?: ReactNode;
};

const HistoryTable: FC<Props> = ({ owner, fallback }) => {
  const { data: items = [], isFetched } = useTradingHistory({ owner });
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
        "--tw-table-cols": 10,
      }}
    >
      <thead className={cn(tableStyles.head, "pl-[2.4rem]")}>
        <tr className={tableStyles.row}>
          <th className={tableStyles.headingCell}>Market</th>
          <th className={tableStyles.headingCell}>Type</th>
          <th className={tableStyles.headingCell}>Side</th>
          <th className={tableStyles.headingCell}>Collateral</th>
          <th className={tableStyles.headingCell}>Size</th>
          <th className={tableStyles.headingCell}>PnL</th>
          <th className={tableStyles.headingCell}>Price</th>
          <th className={tableStyles.headingCell}>Fee</th>
          <th className={tableStyles.headingCell}>Time</th>
          <th className={tableStyles.headingCell}>Trx</th>
        </tr>
      </thead>
      <tbody className={tableStyles.body}>
        {isFetched && items.length === 0 && fallback && (
          <tr className={tableStyles.fallbackRow}>
            <td colSpan={10}>{fallback}</td>
          </tr>
        )}
        {isFetched &&
          items
            .map((tx) => ({
              txid: tx.txid,
              time: tx.time * 1000,
              token: tx.token,
              type: tx.type,
              ...tx.txData,
            }))
            .map((item) => (
              <tr
                key={item.txid}
                className={cn(tableStyles.row, tableStyles.rowDelimiter)}
              >
                <td className={tableStyles.cell}>
                  <TokenBadge token={item.token} showNetwork gap={8} />
                </td>
                <td className={tableStyles.cell}>{getType(item.type)}</td>
                <td className={tableStyles.cell}>
                  {item.side ? (
                    <>
                      <span className="capitalize">{item.side}</span>
                      <span className="text-content-2">
                        {formatRate(item.leverage)}
                      </span>
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td className={tableStyles.cell}>
                  {item.collateral ? (
                    <>
                      <span>
                        {formatCurrency_USD(
                          item.price &&
                            item.collateral &&
                            item.price * item.collateral,
                        )}
                      </span>
                      <span className="text-content-2">
                        ({formatCurrency(item.token)(item.collateral)})
                      </span>
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td className={tableStyles.cell}>
                  {item.size ? (
                    <>
                      <span>
                        {formatCurrency_USD(
                          item.price && item.size && item.price * item.size,
                        )}
                      </span>
                      <span className="text-content-2">
                        ({formatCurrency(item.token)(item.size)})
                      </span>
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td
                  className={cn(tableStyles.cell, {
                    "text-green": item.pnl && item.pnl > 0,
                    "text-red": item.pnl && item.pnl < 0,
                  })}
                >
                  {item.pnl ? (
                    <>
                      <span>
                        {item.pnl > 0 ? "+" : "-"}
                        {formatCurrency_USD(item.pnl && Math.abs(item.pnl))}
                      </span>
                      {item.collateral && item.price && (
                        <span>
                          {item.pnl > 0 ? "+" : "-"}
                          {formatPercentage(
                            Math.abs(item.pnl) / (item.collateral * item.price),
                            2,
                          )}
                        </span>
                      )}
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td className={tableStyles.cell}>
                  {formatCurrency_USD(item.price)}
                </td>
                <td className={tableStyles.cell}>
                  {formatCurrency_USD(item.fee)}
                </td>
                <td className={tableStyles.cell}>
                  <span>
                    {dayjs(item.time).utc(false).format("DD-MM-YYYY")}
                  </span>
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
