import cn from "classnames";
import type { FC } from "react";

import { mkTableStyles } from "@promo-shock/shared/styles/table";
import { formatRate } from "@promo-shock/shared/utils/number";
import { Link } from "@promo-shock/ui-kit/link";
import { Token } from "@promo-shock/ui-kit/token";

type Props = {
  items: {
    txHash: string;
    token: {
      account: string;
      symbol: string;
      network: "solana";
      uri: string;
    };
    side: "short" | "long";
    leverage: number;
    size: number;
    collateral: number;
    pnl: number;
    entryPrice: number;
    markPrice: number;
    liquidationPrice: number;
  }[];
  onManage: (txHash: string) => void;
  onClose: (txHash: string) => void;
};

const PositionsTable: FC<Props> = ({ items, onManage, onClose }) => {
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
          <tr key={item.txHash} className={tableStyles.row}>
            <td className={tableStyles.cell}>
              <Token
                symbol={item.token.symbol}
                uri={item.token.uri}
                network={item.token.network}
                gap={8}
              />
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
                  onClick={() => onManage(item.txHash)}
                ></Link>
                <Link
                  variant="red"
                  text="Close"
                  iconSrc="/icons/close-circle.svg"
                  onClick={() => onClose(item.txHash)}
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
