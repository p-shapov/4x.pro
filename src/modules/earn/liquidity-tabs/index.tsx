"use client";
import type { FC } from "react";

import {
  BurnLPForm,
  MintLPForm,
  useBurnLPForm,
  useMintLPForm,
} from "@4x.pro/components/manage-liquidity";
import type { PoolAccount } from "@4x.pro/services/perpetuals/lib/pool-account";
import { Tabs } from "@4x.pro/ui-kit/tabs";

import { mkLiquidityTabsStyles } from "./styles";

type Props = {
  pool: PoolAccount;
};

const LiquidityTabs: FC<Props> = ({ pool }) => {
  const mintLPForm = useMintLPForm();
  const burnLPForm = useBurnLPForm();
  const liquidityTabsStyles = mkLiquidityTabsStyles();
  return (
    <div className={liquidityTabsStyles.root}>
      <Tabs
        stretchTabs
        items={[
          {
            content: "Mint LP",
            id: "mint",
          },
          {
            content: "Burn LP",
            id: "burn",
          },
        ]}
        panels={{
          mint: <MintLPForm pool={pool} form={mintLPForm} />,
          burn: <BurnLPForm pool={pool} form={burnLPForm} />,
        }}
        classNames={{
          tab: liquidityTabsStyles.tab,
          items: liquidityTabsStyles.tabsList,
          panel: liquidityTabsStyles.content,
        }}
      />
    </div>
  );
};

export { LiquidityTabs };
