"use client";
import type { FC, PropsWithChildren } from "react";

import { useInitIsMounted } from "@4x.pro/shared/hooks/use-is-mounted";

const RootProvider: FC<PropsWithChildren> = ({ children }) => {
  useInitIsMounted();

  return children;
};

export { RootProvider };
