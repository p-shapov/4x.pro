import type { FC } from "react";

import { HistoryTable } from "@4x.pro/components/history-table";

import { HISTORY } from "./mocks";

const UserHistory: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <HistoryTable items={HISTORY as any} />;
};

export { UserHistory };
