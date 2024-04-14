"use client";
import type { FC } from "react";

import { DistributionTable } from "@4x.pro/components/distribution-table";
import type { PoolAccount } from "@4x.pro/services/perpetuals/lib/pool-account";

import { mkTokenDistributionStyles } from "./styles";

type Props = {
  pool: PoolAccount;
};

const TokenDistribution: FC<Props> = ({ pool }) => {
  const tokenDistributionStyles = mkTokenDistributionStyles();
  return (
    <div className={tokenDistributionStyles.root}>
      <span className={tokenDistributionStyles.title}>Token Distribution</span>
      <DistributionTable pool={pool} />
    </div>
  );
};

export { TokenDistribution };
