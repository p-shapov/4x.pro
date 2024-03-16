"use client";
import type { FC, PropsWithChildren } from "react";

import { BaseQueryClientProvider } from "@promo-shock/configs/base-query-client";
import { WalletAdapterProvider } from "@promo-shock/configs/wallet-adapter-config";
import { useInitIsMounted } from "@promo-shock/shared/hooks";

const RootProvider: FC<PropsWithChildren> = ({ children }) => {
  useInitIsMounted();

  return (
    <BaseQueryClientProvider>
      <WalletAdapterProvider>{children}</WalletAdapterProvider>
    </BaseQueryClientProvider>
  );
};

export { RootProvider };
