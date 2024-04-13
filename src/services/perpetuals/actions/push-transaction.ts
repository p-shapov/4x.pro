import type { Token } from "@4x.pro/app-config";

import type { TransactionLogData, TransactionType } from "../lib/types";

const pushTransaction = async (
  account: string,
  token: Token,
  type: TransactionType,
  time: number,
  txid: string,
  txData: TransactionLogData,
) => {
  const prevTransactions =
    localStorage.getItem(`4xprotocol-tx-history-${account}`) || "[]";
  const transactions = JSON.parse(prevTransactions);
  transactions.push({
    token,
    type,
    time,
    txid,
    txData,
  });
  localStorage.setItem(
    `4xprotocol-tx-history-${account}`,
    JSON.stringify(transactions),
  );
};

export { pushTransaction };
