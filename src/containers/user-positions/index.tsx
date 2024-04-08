"use client";
import { useWallet } from "@solana/wallet-adapter-react";

import { NoDataFallback } from "@4x.pro/components/no-data-fallback";
import { PositionsTable } from "@4x.pro/components/positions-table";

const UserPositions = () => {
  const walletContextState = useWallet();
  return (
    <PositionsTable
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

export { UserPositions };
