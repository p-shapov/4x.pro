import type { FC } from "react";

import { HistoryTable } from "@4x.pro/components/history-table";
import { useTradingHistory } from "@4x.pro/services/trading-history/hooks/use-trading-history";

const UserHistory: FC = () => {
  const tradingHistory = useTradingHistory();
  if (!tradingHistory.data) return null;
  return (
    <HistoryTable
      items={tradingHistory.data.map((tx) => ({
        txid: tx.txid,
        time: tx.time * 1000,
        token: tx.token,
        type: tx.type,
        ...tx.txData,
      }))}
    />
  );
};

export { UserHistory };
