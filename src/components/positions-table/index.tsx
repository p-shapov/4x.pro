import cn from "classnames";
import type { FC } from "react";

import type { Token } from "@4x.pro/configs/dex-platform";
import { mkTableStyles } from "@4x.pro/shared/styles/table";
import { formatRate } from "@4x.pro/shared/utils/number";
import { Link } from "@4x.pro/ui-kit/link";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";

type Props = {
  items: {
    id: string;
    asset: Token;
    side: "short" | "long";
    leverage: number;
    size: number;
    collateral: number;
    pnl: number;
    entryPrice: number;
    markPrice: number;
    liquidationPrice: number;
  }[];
};

const PositionsTable: FC<Props> = ({ items }) => {
  const tableStyles = mkTableStyles();
  return (
    <table
      className={tableStyles.root}
      style={{
        // @ts-expect-error - CSS variable
        "--tw-table-cols": 9,
      }}
    >
      <thead className={cn(tableStyles.head, "pl-[2.4rem]")}>
        <tr className={tableStyles.row}>
          <th className={tableStyles.headingCell}>Market</th>
          <th className={tableStyles.headingCell}>Side</th>
          <th className={tableStyles.headingCell}>Size</th>
          <th className={tableStyles.headingCell}>Collateral</th>
          <th className={tableStyles.headingCell}>PnL</th>
          <th className={tableStyles.headingCell}>Entry Price</th>
          <th className={tableStyles.headingCell}>Mark Price</th>
          <th className={tableStyles.headingCell}>Liq Price</th>
          <th className={tableStyles.headingCell}>Actions</th>
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
            <td className={tableStyles.cell}>
              <span className="capitalize">{item.side}</span>{" "}
              <span className="text-content-2">
                ({formatRate(item.leverage)})
              </span>
            </td>
            <td className={tableStyles.cell}>{item.size}</td>
            <td className={tableStyles.cell}>{item.collateral}</td>
            <td className={tableStyles.cell}>
              <span className="text-green">{item.pnl}</span>
            </td>
            <td className={tableStyles.cell}>{item.entryPrice}</td>
            <td className={tableStyles.cell}>{item.markPrice}</td>
            <td className={tableStyles.cell}>{item.liquidationPrice}</td>
            <td className={tableStyles.cell}>
              <div className={cn("flex", "gap-[2rem]")}>
                <Link
                  variant="accent"
                  text="Manage"
                  iconSrc="/icons/setting-2.svg"
                ></Link>
                <Link
                  variant="red"
                  text="Close"
                  iconSrc="/icons/close-circle.svg"
                ></Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { PositionsTable };
