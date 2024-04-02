"use client";
import type { FC, PropsWithChildren } from "react";

import { AppConfigProvider } from "@4x.pro/app-config";
import { useInitPythConnection } from "@4x.pro/shared/hooks/use-pyth-connection";

const PerpetualsPageProvider: FC<PropsWithChildren> = ({ children }) => {
  useInitPythConnection();
  return <AppConfigProvider>{children}</AppConfigProvider>;
};

export { PerpetualsPageProvider };
