import type { PublicKey } from "@solana/web3.js";
import cn from "classnames";
import type { FC, ReactNode } from "react";

import type { Coin } from "@4x.pro/app-config";
import { useTokenBalance } from "@4x.pro/shared/hooks/use-token-balance";
import { mkTableStyles } from "@4x.pro/shared/styles/table";
import { formatCurrency } from "@4x.pro/shared/utils/number";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";
import { TokenPrice } from "@4x.pro/ui-kit/token-price";

type Props = {
  publicKey: PublicKey | null;
  coinList: readonly Coin[];
  fallback?: ReactNode;
};

const TableRow: FC<{ publicKey: PublicKey | null; asset: Coin }> = ({
  publicKey,
  asset,
}) => {
  const tableStyles = mkTableStyles();
  const tokenBalance = useTokenBalance({
    token: asset,
    account: publicKey,
  });
  return (
    <tr className={cn(tableStyles.row, tableStyles.rowDelimiter)} key={asset}>
      <td className={tableStyles.cell}>
        <TokenBadge token={asset} gap={8} />
      </td>
      <td className={tableStyles.cell}>
        {formatCurrency(asset)(tokenBalance.data, 2)}
      </td>
      <td className={tableStyles.cell}>
        <TokenPrice token={asset} fractionalDigits={2} watch>
          {tokenBalance.data || null}
        </TokenPrice>
      </td>
      <td className={tableStyles.cell}>
        <TokenPrice token={asset} fractionalDigits={2} watch />
      </td>
    </tr>
  );
};

const BalancesTable: FC<Props> = ({ publicKey, coinList, fallback }) => {
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
        {!publicKey && (
          <tr className={tableStyles.fallbackRow}>
            <td colSpan={4}>{fallback}</td>
          </tr>
        )}
        {publicKey &&
          coinList.map((asset) => (
            <TableRow key={asset} publicKey={publicKey} asset={asset} />
          ))}
      </tbody>
    </table>
  );
};

export { BalancesTable };
