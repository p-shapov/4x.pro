import type { PublicKey } from "@solana/web3.js";
import type { FC } from "react";

import { usePositions } from "@4x.pro/services/perpetuals/hooks/use-positions";

import { PositionRow } from "./position-row";
import { mkPositionsTableStyles } from "./styles";

type Props = {
  owner?: PublicKey | null;
  fallback?: React.ReactNode;
};

const PositionsTable: FC<Props> = ({ owner, fallback }) => {
  const positionStyles = mkPositionsTableStyles();
  const { data: positions = {}, isFetched } = usePositions({ owner });
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
        {isFetched && Object.keys(positions).length === 0 && (
          <tr className={positionStyles.fallbackRow}>
            <td colSpan={9}>{fallback}</td>
          </tr>
        )}
        {isFetched &&
          Object.values(positions).map((position) => (
            <PositionRow
              key={position.address.toString()}
              position={position}
            />
          ))}
      </tbody>
    </table>
  );
};

export { PositionsTable };
