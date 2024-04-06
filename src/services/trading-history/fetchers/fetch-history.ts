import type { Transaction } from "../utils/types";

const getHistory = async (account: string) => {
  const prevPositions =
    localStorage.getItem(`4xprotocol-tx-history-${account}`) || "[]";
  return JSON.parse(prevPositions) as Transaction[];
};

export { getHistory };
