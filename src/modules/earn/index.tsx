"use client";
import type { FC } from "react";

import { usePools } from "@4x.pro/services/perpetuals/hooks/use-pools";

import { LiquidityTabs } from "./liquidity-tabs";
import { mkEarnModuleStyles } from "./styles";
import { TokenDistribution } from "./token-distribution";

const EarnModule: FC = () => {
  const earnModuleStyles = mkEarnModuleStyles();
  const { data: pools } = usePools();
  const pool = Object.values(pools || {})?.[0];
  if (!pool) {
    return null;
  }
  return (
    <div className={earnModuleStyles.root}>
      <LiquidityTabs pool={pool} />
      <TokenDistribution pool={pool} />
    </div>
  );
};

export { EarnModule };
