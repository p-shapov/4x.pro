"use client";

import type { FC, PropsWithChildren } from "react";

import { BaseQueryClientProvider } from "@4x.pro/configs/base-query-client";
import { WalletAdapterProvider } from "@4x.pro/configs/wallet-adapter-config";
import { useInitIsMounted } from "@4x.pro/shared/hooks";

const RootProvider: FC<PropsWithChildren> = ({ children }) => {
  useInitIsMounted();

  return (
    <BaseQueryClientProvider>
      <WalletAdapterProvider>{children}</WalletAdapterProvider>
    </BaseQueryClientProvider>
  );
};

export { RootProvider };
