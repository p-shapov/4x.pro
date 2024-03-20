import cn from "classnames";
import type { FC } from "react";

import type { Token } from "@4x.pro/configs/token-config";
import { useTokenInfo } from "@4x.pro/shared/hooks/use-token-info";
import { mkTableStyles } from "@4x.pro/shared/styles/table";
import { formatCurrency_USD } from "@4x.pro/shared/utils/number";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";

type Props = {
  items: {
    asset: Token;
    balance: number;
  }[];
};

const TableRow: FC<{ asset: Token; balance: number }> = ({
  asset,
  balance,
}) => {
  const tableStyles = mkTableStyles();
  const { priceData } = useTokenInfo(asset);
  return (
    <tr className={cn(tableStyles.row, tableStyles.rowDelimiter)} key={asset}>
      <td className={tableStyles.cell}>
        <TokenBadge token={asset} gap={8} />
      </td>
      <td className={tableStyles.cell}>{balance}</td>
      <td className={tableStyles.cell}>-</td>
      <td className={tableStyles.cell}>
        {formatCurrency_USD(priceData?.price && priceData.price * balance, 2)}
      </td>
    </tr>
  );
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
          <TableRow key={item.asset} {...item} />
        ))}
      </tbody>
    </table>
  );
};

export { BalancesTable };
