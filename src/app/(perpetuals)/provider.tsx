"use client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FC, PropsWithChildren } from "react";

import { AppConfigProvider } from "@4x.pro/app-config";
import { useInitPythConnection } from "@4x.pro/shared/hooks/use-pyth-connection";

dayjs.extend(utc);

const PerpetualsPageProvider: FC<PropsWithChildren> = ({ children }) => {
  useInitPythConnection();
  return <AppConfigProvider>{children}</AppConfigProvider>;
};

export { PerpetualsPageProvider };
