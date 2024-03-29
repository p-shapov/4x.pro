import type { FC } from "react";

import { BalancesTable } from "@4x.pro/components/balances-table";

import { BALANCES } from "./mocks";

const UserBalances: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <BalancesTable items={BALANCES as any} />;
};

export { UserBalances };
