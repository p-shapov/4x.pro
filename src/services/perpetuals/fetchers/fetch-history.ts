import type { TransactionLog } from "../lib/types";

const getHistory = async (account: string) => {
  const prevPositions =
    localStorage.getItem(`4xprotocol-tx-history-${account}`) || "[]";
  return JSON.parse(prevPositions) as TransactionLog[];
};

export { getHistory };
