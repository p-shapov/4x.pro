import type { PublicKey } from "@solana/web3.js";
import cn from "classnames";
import { Fragment } from "react";
import type { FC, ReactNode } from "react";

import { usePositions } from "@4x.pro/services/perpetuals/hooks/use-positions";

import { OrderRow } from "./order-row";
import { mkOrdersTableStyles } from "./styles";

type Props = {
  owner?: PublicKey | null;
  fallback?: ReactNode;
};

const OrdersTable: FC<Props> = ({ owner, fallback }) => {
  const orderTableStyles = mkOrdersTableStyles();
  const { data: positions = {}, isFetched } = usePositions({ owner });
  const orders = Object.values(positions).filter(
    (position) => position.stopLoss || position.takeProfit,
  );
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
        {orders.length === 0 && isFetched && (
          <tr className={orderTableStyles.fallbackRow}>
            <td colSpan={6}>{fallback}</td>
          </tr>
        )}
        {isFetched &&
          orders.map((item) => (
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
