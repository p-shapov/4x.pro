import type { FC } from "react";

import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";

import { PositionRow } from "./position-row";
import { mkPositionsTableStyles } from "./styles";

type Props = {
  items: PositionAccount[];
};

const PositionsTable: FC<Props> = ({ items }) => {
  const positionStyles = mkPositionsTableStyles();
  return (
    <table
      className={positionStyles.root}
      style={{
        // @ts-expect-error - CSS variable
        "--tw-table-cols": 9,
      }}
    >
      <thead className={positionStyles.head}>
        <tr className={positionStyles.row}>
          <th className={positionStyles.headingCell}>Market</th>
          <th className={positionStyles.headingCell}>Side</th>
          <th className={positionStyles.headingCell}>Size</th>
          <th className={positionStyles.headingCell}>Collateral</th>
          <th className={positionStyles.headingCell}>PnL</th>
          <th className={positionStyles.headingCell}>Entry Price</th>
          <th className={positionStyles.headingCell}>Mark Price</th>
          <th className={positionStyles.headingCell}>Liq Price</th>
          <th className={positionStyles.headingCell}>Actions</th>
        </tr>
      </thead>
      <tbody className={positionStyles.body}>
        {items.map((position) => (
          <PositionRow key={position.address.toBase58()} position={position} />
        ))}
      </tbody>
    </table>
  );
};

export { PositionsTable };
