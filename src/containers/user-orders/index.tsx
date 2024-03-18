import type { FC } from "react";

import { OrdersTable } from "@4x.pro/components/orders-table";

import { ORDERS } from "./mocks";

const UserOrders: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <OrdersTable items={ORDERS as any} />;
};

export { UserOrders };
