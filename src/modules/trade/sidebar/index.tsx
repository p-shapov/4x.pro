import type { FC } from "react";
import { useState } from "react";
import { useWatch } from "react-hook-form";

import type { useTradeForm } from "@4x.pro/components/trade-form";
import { TradeForm, TradeFormProvider } from "@4x.pro/components/trade-form";
import { TradeStats } from "@4x.pro/components/trade-stats";
import { Tabs } from "@4x.pro/ui-kit/tabs";

import { mkSidebarStyles } from "./styles";
import { useTradeModule } from "../store";

type Props = {
  tradeForm: ReturnType<typeof useTradeForm>;
};

const Sidebar: FC<Props> = ({ tradeForm }) => {
  const sidebarStyles = mkSidebarStyles();
  const { selectedAsset, favorites } = useTradeModule((state) => ({
    selectedAsset: state.selectedAsset,
    favorites: state.favorites,
  }));
  const leverage = useWatch({ control: tradeForm.control, name: "leverage" });
  const [side, setSide] = useState<"long" | "short">("long");
  const collateralTokens = favorites.includes(selectedAsset)
    ? favorites
    : [selectedAsset, ...favorites];
  return (
    <div className={sidebarStyles.root}>
      <div className={sidebarStyles.tabs}>
        <TradeFormProvider>
          <Tabs
            stretchTabs
            value={side}
            onChange={setSide}
            classNames={{
              tab: sidebarStyles.tab,
              panels: sidebarStyles.tabContent,
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
                <TradeForm
                  side="long"
                  form={tradeForm}
                  collateralTokens={collateralTokens}
                />
              ),
              short: (
                <TradeForm
                  side="short"
                  form={tradeForm}
                  collateralTokens={collateralTokens}
                />
              ),
            }}
          />
        </TradeFormProvider>
      </div>
      <div className={sidebarStyles.stats}>
        <TradeStats
          collateral={selectedAsset}
          side={side}
          leverage={leverage}
        />
      </div>
    </div>
  );
};

export { Sidebar };
