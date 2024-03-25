"use client";
import type { FC, PropsWithChildren } from "react";

import { DexPlatformProvider } from "@4x.pro/configs/dex-platform";

const PlatformProvider: FC<PropsWithChildren> = ({ children }) => {
  return <DexPlatformProvider>{children}</DexPlatformProvider>;
};

export { PlatformProvider };
