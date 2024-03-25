"use client";
import type { FC, PropsWithChildren } from "react";

import { WalletsDialog } from "@4x.pro/components/connection";
import { DexPlatformProvider } from "@4x.pro/configs/dex-platform";

const PlatformProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <DexPlatformProvider>
      {children}
      <WalletsDialog />
    </DexPlatformProvider>
  );
};

export { PlatformProvider };
