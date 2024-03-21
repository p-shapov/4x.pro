"use client";

import type { FC, PropsWithChildren } from "react";

import { WalletsDialog } from "@4x.pro/components/connection";
import { BaseQueryClientProvider } from "@4x.pro/configs/base-query-client";
import { SolanaWalletAdapterProvider } from "@4x.pro/configs/solana-wallet-adapter-config";
import { useInitIsMounted } from "@4x.pro/shared/hooks/use-is-mounted";

const RootProvider: FC<PropsWithChildren> = ({ children }) => {
  useInitIsMounted();

  return (
    <BaseQueryClientProvider>
      <SolanaWalletAdapterProvider>
        {children}
        <WalletsDialog />
      </SolanaWalletAdapterProvider>
    </BaseQueryClientProvider>
  );
};

export { RootProvider };
