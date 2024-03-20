"use client";
import { useRef, useState } from "react";
import { useWatch } from "react-hook-form";

import { TradeFormProvider, useTradeForm } from "@4x.pro/components/trade-form";
import { TradeStats } from "@4x.pro/components/trade-stats";
import { TradeLongForm } from "@4x.pro/containers/trade-long-form";
import { TradeShortForm } from "@4x.pro/containers/trade-short-form";
import { UserBalances } from "@4x.pro/containers/user-balances";
import { UserHistory } from "@4x.pro/containers/user-history";
import { UserOrders } from "@4x.pro/containers/user-orders";
import { UserPositions } from "@4x.pro/containers/user-positions";
import { useResizableLayout } from "@4x.pro/shared/hooks/use-resizable-layout";
import { Tabs } from "@4x.pro/ui-kit/tabs";

import { mkTradeModuleStyles } from "./styles";

const TRADING_VIEW_ID = "trading-view";

const TradeModule = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState<"long" | "short">("long");
  const { position, separatorProps, isDragging } = useResizableLayout(
    "trade-module",
    {
      initial: 500,
      max: 600,
      min: 200,
      axis: "y",
      containerRef: contentRef,
    },
  );
  const tradeModuleStyles = mkTradeModuleStyles({
    layoutIsDragging: isDragging,
  });
  const tradeForm = useTradeForm({
    defaultPositionTokens: {
      base: "Sol_BTC",
      quote: "Sol_SOL",
    },
  });
  const leverage = useWatch({ control: tradeForm.control, name: "leverage" });
  return (
    <div className={tradeModuleStyles.root}>
      <div className={tradeModuleStyles.header}></div>
      <div className={tradeModuleStyles.content} ref={contentRef}>
        <div
          id={TRADING_VIEW_ID}
          className={tradeModuleStyles.tradingView}
          style={{ height: position }}
        >
          TRADING VIEW
        </div>
        <div
          className={tradeModuleStyles.contentSeparator}
          {...separatorProps}
        ></div>
        <div className={tradeModuleStyles.tableTabs}>
          <Tabs
            classNames={{
              tab: tradeModuleStyles.tableTab,
              panels: tradeModuleStyles.tableTabContent,
              panel: tradeModuleStyles.tableTabPanel,
            }}
            items={[
              {
                id: "positions",
                content: "Positions",
              },
              {
                id: "orders",
                content: "Orders",
              },
              {
                id: "history",
                content: "History",
              },
              {
                id: "balances",
                content: "Balances",
              },
            ]}
            panels={{
              positions: <UserPositions />,
              orders: <UserOrders />,
              history: <UserHistory />,
              balances: <UserBalances />,
            }}
          />
        </div>
      </div>
      <div className={tradeModuleStyles.sidebar}>
        <div className={tradeModuleStyles.sidebarTabs}>
          <TradeFormProvider>
            <Tabs
              stretchTabs
              value={side}
              onChange={setSide}
              classNames={{
                tab: tradeModuleStyles.sidebarTab,
                panels: tradeModuleStyles.sidebarTabContent,
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
                long: <TradeLongForm form={tradeForm} quoteToken="Sol_SOL" />,
                short: <TradeShortForm form={tradeForm} quoteToken="Sol_SOL" />,
              }}
            />
          </TradeFormProvider>
        </div>
        <div className={tradeModuleStyles.sidebarStats}>
          <TradeStats
            collateralToken="Sol_SOL"
            side={side}
            leverage={leverage}
          />
        </div>
      </div>
    </div>
  );
};

export { TradeModule };
