import cn from "classnames";
import type { FC } from "react";

import type { Token } from "@4x.pro/configs/token-config";
import { mkTableStyles } from "@4x.pro/shared/styles/table";
import { formatRate } from "@4x.pro/shared/utils/number";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";

type Props = {
  items: {
    id: string;
    txHash: string;
    asset: Token;
    type: "open" | "close";
    side: "short" | "long";
    leverage: number;
    pnl: number;
    price: number;
    fee: number;
    time: number;
  }[];
};

const HistoryTable: FC<Props> = ({ items }) => {
  const tableStyles = mkTableStyles();
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
            key={item.id}
            className={cn(tableStyles.row, tableStyles.rowDelimiter)}
          >
            <td className={tableStyles.cell}>
              <TokenBadge token={item.asset} showNetwork gap={8} />
            </td>
            <td className={tableStyles.cell}>{item.type}</td>
            <td className={tableStyles.cell}>
              <span className="capitalize">{item.side}</span>{" "}
              <span className="text-content-2">
                ({formatRate(item.leverage)})
              </span>
            </td>
            <td className={tableStyles.cell}>{item.pnl}</td>
            <td className={tableStyles.cell}>{item.price}</td>
            <td className={tableStyles.cell}>{item.fee}</td>
            <td className={tableStyles.cell}>{item.time}</td>
            <td className={tableStyles.cell}>{item.txHash}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { HistoryTable };
