import type { FC } from "react";

import { UserBalances } from "@4x.pro/containers/user-balances";
import { UserHistory } from "@4x.pro/containers/user-history";
import { UserOrders } from "@4x.pro/containers/user-orders";
import { UserPositions } from "@4x.pro/containers/user-positions";
import { Tabs } from "@4x.pro/ui-kit/tabs";

import { mkTablesStyles } from "./styles";

const Tables: FC = () => {
  const tablesStyles = mkTablesStyles();
  return (
    <div className={tablesStyles.root}>
      <Tabs
        classNames={{
          tab: tablesStyles.tab,
          panels: tablesStyles.tabContent,
          panel: tablesStyles.tabPanel,
          items: tablesStyles.tabsList,
        }}
        items={[
          {
            id: "positions",
            content: "Positions",
          },
          {
            id: "orders",
            content: "Orders",
          },
          {
            id: "history",
            content: "History",
          },
          {
            id: "balances",
            content: "Balances",
          },
        ]}
        panels={{
          positions: <UserPositions />,
          orders: <UserOrders />,
          history: <UserHistory />,
          balances: <UserBalances />,
        }}
      />
    </div>
  );
};

export { Tables };
