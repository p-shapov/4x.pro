"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";

import { NoDataFallback } from "@4x.pro/components/no-data-fallback";
import { OrdersTable } from "@4x.pro/components/orders-table";

const UserOrders: FC = () => {
  const walletContextState = useWallet();
  return (
    <OrdersTable
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

export { UserOrders };
