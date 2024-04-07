import type { Token } from "@4x.pro/app-config";

type TransactionType =
  | "open"
  | "close"
  | "liquidation"
  | "stop"
  | "take-profit"
  | "add-collateral"
  | "remove-collateral";
type Side = "long" | "short";
type TransactionData = {
  side?: Side;
  price?: number;
  fee?: number;
  pnl?: number;
  leverage?: number;
  collateral?: number;
  size?: number;
};
type Transaction = {
  token: Token;
  type: TransactionType;
  time: number;
  txid: string;
  txData: TransactionData;
};

export type { Transaction, TransactionData, TransactionType, Side };
