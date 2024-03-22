import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

import { TradeFormProvider, useTradeForm } from "@4x.pro/components/trade-form";
import { TradeStats } from "@4x.pro/components/trade-stats";
import { TradeLongForm } from "@4x.pro/containers/trade-long-form";
import { TradeShortForm } from "@4x.pro/containers/trade-short-form";
import { Tabs } from "@4x.pro/ui-kit/tabs";

import { mkSidebarStyles } from "./styles";
import { useTradeModule } from "../store";

const Sidebar = () => {
  const sidebarStyles = mkSidebarStyles();
  const selectedAsset = useTradeModule((state) => state.selectedAsset);
  const tradeForm = useTradeForm();
  const leverage = useWatch({ control: tradeForm.control, name: "leverage" });
  const [side, setSide] = useState<"long" | "short">("long");
  const quote = useWatch({
    control: tradeForm.control,
    name: "position.quote",
  });
  useEffect(() => {
    if (selectedAsset) {
      tradeForm.setValue("position.quote", {
        size: quote.size,
        token: selectedAsset,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset]);
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
              long: <TradeLongForm form={tradeForm} />,
              short: <TradeShortForm form={tradeForm} />,
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
