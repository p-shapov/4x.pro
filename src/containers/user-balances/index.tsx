"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";

import { tokenList } from "@4x.pro/app-config";
import { BalancesTable } from "@4x.pro/components/balances-table";

const UserBalances: FC = () => {
  const { publicKey } = useWallet();
  return <BalancesTable publicKey={publicKey} tokenList={tokenList} />;
};

export { UserBalances };
