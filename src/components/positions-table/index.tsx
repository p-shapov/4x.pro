import type { ComponentProps, FC } from "react";

import { PositionRow } from "./position-row";
import { mkPositionsTableStyles } from "./styles";

type Props = {
  items: ComponentProps<typeof PositionRow>[];
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
        {items.map(({ id, ...rest }) => (
          <PositionRow key={id} id={id} {...rest} />
        ))}
      </tbody>
    </table>
  );
};

export { PositionsTable };
