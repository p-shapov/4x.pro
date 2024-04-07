import type { FC } from "react";

import { OrdersTable } from "@4x.pro/components/orders-table";
import { useUserPositionOrders } from "@4x.pro/services/perpetuals/hooks/use-positions";

const UserOrders: FC = () => {
  const { data } = useUserPositionOrders();
  if (!data) return null;
  return <OrdersTable items={Object.values(data)} />;
};

export { UserOrders };
