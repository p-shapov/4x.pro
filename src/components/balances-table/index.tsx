import cn from "classnames";
import type { FC } from "react";

import { mkTableStyles } from "@promo-shock/shared/styles/table";
import { Token } from "@promo-shock/ui-kit/token";

type Props = {
  items: {
    asset: {
      account: string;
      symbol: string;
      uri: string;
    };
    balance: number;
  }[];
};

const BalancesTable: FC<Props> = ({ items }) => {
  const tableStyles = mkTableStyles();
  return (
    <table
      className={tableStyles.root}
      style={{
        // @ts-expect-error - CSS variable
        "--tw-table-cols": 4,
      }}
    >
      <thead className={cn(tableStyles.head, "pl-[2.4rem]")}>
        <tr className={tableStyles.row}>
          <th className={tableStyles.headingCell}>Asset</th>
          <th className={tableStyles.headingCell}>Balance</th>
          <th className={tableStyles.headingCell}>Value</th>
          <th className={tableStyles.headingCell}>Price</th>
        </tr>
      </thead>
      <tbody className={tableStyles.body}>
        {items.map((item) => (
          <tr
            key={item.asset.account}
            className={cn(tableStyles.row, tableStyles.rowDelimiter)}
          >
            <td className={tableStyles.cell}>
              <Token symbol={item.asset.symbol} uri={item.asset.uri} gap={8} />
            </td>
            <td className={tableStyles.cell}>{item.balance}</td>
            <td className={tableStyles.cell}>0.5</td>
            <td className={tableStyles.cell}>0.5</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { BalancesTable };
