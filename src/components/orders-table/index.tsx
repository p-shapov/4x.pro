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
    leverage: number;
    side: "short" | "long";
    size: number;
    type: "tp" | "sl";
    markPrice: number;
    triggerPrice: number;
  }[];
};

const OrdersTable: FC<Props> = ({ items }) => {
  const tableStyles = mkTableStyles();
  return (
    <table
      className={tableStyles.root}
      style={{
        // @ts-expect-error - CSS variable
        "--tw-table-cols": 7,
      }}
    >
      <thead className={cn(tableStyles.head, "pl-[2.4rem]")}>
        <tr className={tableStyles.row}>
          <th className={tableStyles.headingCell}>Market</th>
          <th className={tableStyles.headingCell}>Side</th>
          <th className={tableStyles.headingCell}>Size</th>
          <th className={tableStyles.headingCell}>Type</th>
          <th className={tableStyles.headingCell}>Mark Price</th>
          <th className={tableStyles.headingCell}>Trigger Price</th>
          <th className={tableStyles.headingCell}>Action</th>
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
            <td className={tableStyles.cell}>{item.type}</td>
            <td className={tableStyles.cell}>{item.markPrice}</td>
            <td className={tableStyles.cell}>{item.triggerPrice}</td>
            <td className={tableStyles.cell}>
              <div className={cn("flex", "gap-[2rem]")}>
                <Link
                  variant="red"
                  text="Cancel"
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

export { OrdersTable };
