"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";

import { HistoryTable } from "@4x.pro/components/history-table";
import { NoDataFallback } from "@4x.pro/components/no-data-fallback";

const UserHistory: FC = () => {
  const walletContextState = useWallet();
  return (
    <HistoryTable
      owner={walletContextState.publicKey}
      fallback={
        <NoDataFallback
          iconSrc="/icons/wallet-remove.svg"
          message="No transactions yet"
          showConnect
        />
      }
    />
  );
};

export { UserHistory };
