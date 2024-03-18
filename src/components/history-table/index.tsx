import cn from "classnames";
import type { FC } from "react";

import { mkTableStyles } from "@promo-shock/shared/styles/table";
import { formatRate } from "@promo-shock/shared/utils/number";
import { Token } from "@promo-shock/ui-kit/token";

type Props = {
  items: {
    id: string;
    txHash: string;
    token: {
      account: string;
      symbol: string;
      network: "solana";
      uri: string;
    };
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
              <Token
                symbol={item.token.symbol}
                uri={item.token.uri}
                network={item.token.network}
                gap={8}
              />
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
