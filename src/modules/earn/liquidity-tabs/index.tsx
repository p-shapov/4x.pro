"use client";
import type { FC } from "react";

import {
  BurnLPForm,
  MintLPForm,
  useBurnLPForm,
  useMintLPForm,
} from "@4x.pro/components/manage-liquidity";
import { Tabs } from "@4x.pro/ui-kit/tabs";

import { mkLiquidityTabsStyles } from "./styles";

const LiquidityTabs: FC = () => {
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
          mint: <MintLPForm form={mintLPForm} />,
          burn: <BurnLPForm form={burnLPForm} />,
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
