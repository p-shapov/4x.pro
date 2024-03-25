import { useConnection } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";
import cn from "classnames";
import type { FC } from "react";

import type { Token } from "@4x.pro/configs/dex-platform";
import { useTokenBalance } from "@4x.pro/shared/hooks/use-token-balance";
import { mkTableStyles } from "@4x.pro/shared/styles/table";
import { formatCurrency } from "@4x.pro/shared/utils/number";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";
import { TokenPrice } from "@4x.pro/ui-kit/token-price";

type Props = {
  publicKey: PublicKey | null;
  tokenList: readonly Token[];
};

const TableRow: FC<{ publicKey: PublicKey | null; asset: Token }> = ({
  publicKey,
  asset,
}) => {
  const { connection } = useConnection();
  const tableStyles = mkTableStyles();
  const tokenBalance = useTokenBalance(connection)({
    variables: {
      token: asset,
      publicKeyBase58: publicKey?.toBase58(),
    },
  });
  return (
    <tr className={cn(tableStyles.row, tableStyles.rowDelimiter)} key={asset}>
      <td className={tableStyles.cell}>
        <TokenBadge token={asset} gap={8} />
      </td>
      <td className={tableStyles.cell}>
        {formatCurrency(asset)(tokenBalance.data)}
      </td>
      <td className={tableStyles.cell}>
        <TokenPrice token={asset}>{tokenBalance.data}</TokenPrice>
      </td>
      <td className={tableStyles.cell}>
        <TokenPrice token={asset} />
      </td>
    </tr>
  );
};

const BalancesTable: FC<Props> = ({ publicKey, tokenList }) => {
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
        {tokenList.map((asset) => (
          <TableRow key={asset} publicKey={publicKey} asset={asset} />
        ))}
      </tbody>
    </table>
  );
};

export { BalancesTable };
