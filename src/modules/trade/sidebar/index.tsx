import type { FC } from "react";
import { useState } from "react";
import { useWatch } from "react-hook-form";

import type { useOpenPositionForm } from "@4x.pro/components/manage-position";
import {
  OpenPositionForm,
  OpenPositionFormProvider,
} from "@4x.pro/components/manage-position";
import { TradeStats } from "@4x.pro/components/trade-stats";
import type { PoolAccount } from "@4x.pro/services/perpetuals/lib/pool-account";
import { Tabs } from "@4x.pro/ui-kit/tabs";

import { mkSidebarStyles } from "./styles";
import { useTradeModule } from "../store";

type Props = {
  pool: PoolAccount;
  openPositionForm: ReturnType<typeof useOpenPositionForm>;
};

const Sidebar: FC<Props> = ({ pool, openPositionForm }) => {
  const sidebarStyles = mkSidebarStyles();
  const { selectedAsset, favorites } = useTradeModule((state) => ({
    selectedAsset: state.selectedAsset,
    favorites: state.favorites,
  }));
  const leverage = useWatch({
    control: openPositionForm.control,
    name: "leverage",
  });
  const collateral = useWatch({
    control: openPositionForm.control,
    name: "position.quote.size",
  });
  const [side, setSide] = useState<"long" | "short">("long");
  const collateralTokens = favorites.includes(selectedAsset)
    ? favorites
    : [selectedAsset, ...favorites];
  return (
    <div className={sidebarStyles.root}>
      <div className={sidebarStyles.tabs}>
        <OpenPositionFormProvider>
          <Tabs
            stretchTabs
            value={side}
            onChange={setSide}
            classNames={{
              tab: sidebarStyles.tab,
              panels: sidebarStyles.tabContent,
              items: sidebarStyles.tabsList,
            }}
            items={[
              {
                id: "long",
                content: "Long",
              },
              {
                id: "short",
                content: "Short",
              },
            ]}
            panels={{
              long: (
                <OpenPositionForm
                  pool={pool}
                  side="long"
                  form={openPositionForm}
                  collateralTokens={collateralTokens}
                />
              ),
              short: (
                <OpenPositionForm
                  pool={pool}
                  side="short"
                  form={openPositionForm}
                  collateralTokens={collateralTokens}
                />
              ),
            }}
          />
        </OpenPositionFormProvider>
      </div>
      <div className={sidebarStyles.stats}>
        <TradeStats
          pool={pool}
          collateral={collateral}
          collateralToken={selectedAsset}
          side={side}
          leverage={leverage}
        />
      </div>
    </div>
  );
};

export { Sidebar };
