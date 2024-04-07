import cn from "classnames";
import { Fragment } from "react";
import type { FC } from "react";

import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";

import { OrderRow } from "./order-row";
import { mkOrdersTableStyles } from "./styles";

type Props = {
  items: PositionAccount[];
};

const OrdersTable: FC<Props> = ({ items }) => {
  const orderTableStyles = mkOrdersTableStyles();
  return (
    <table
      className={orderTableStyles.root}
      style={{
        // @ts-expect-error - CSS variable
        "--tw-table-cols": 6,
      }}
    >
      <thead className={cn(orderTableStyles.head, "pl-[2.4rem]")}>
        <tr className={orderTableStyles.row}>
          <th className={orderTableStyles.headingCell}>Market</th>
          <th className={orderTableStyles.headingCell}>Side</th>
          <th className={orderTableStyles.headingCell}>Size</th>
          <th className={orderTableStyles.headingCell}>Type</th>
          <th className={orderTableStyles.headingCell}>Mark Price</th>
          <th className={orderTableStyles.headingCell}>Trigger Price</th>
          {/* <th className={orderTableStyles.headingCell}>Action</th> */}
        </tr>
      </thead>
      <tbody className={orderTableStyles.body}>
        {items.map((item) => (
          <Fragment key={item.address.toString()}>
            {item.stopLoss && item.takeProfit ? (
              <>
                <OrderRow position={item} type="sl" />
                <OrderRow position={item} type="tp" />
              </>
            ) : (
              <OrderRow position={item} type={item.stopLoss ? "sl" : "tp"} />
            )}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};

export { OrdersTable };
