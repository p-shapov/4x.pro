"use client";
import { useRef, useState } from "react";
import { useWatch } from "react-hook-form";

import { useTradeForm } from "@4x.pro/components/trade-form";
import { TradeStats } from "@4x.pro/components/trade-stats";
import { TradeLongForm } from "@4x.pro/containers/trade-long-form";
import { TradeShortForm } from "@4x.pro/containers/trade-short-form";
import { UserBalances } from "@4x.pro/containers/user-balances";
import { UserHistory } from "@4x.pro/containers/user-history";
import { UserOrders } from "@4x.pro/containers/user-orders";
import { UserPositions } from "@4x.pro/containers/user-positions";
import { useResizableLayout } from "@4x.pro/shared/hooks/use-resizable-layout";
import { Tabs } from "@4x.pro/ui-kit/tabs";

import { BASE_TOKENS, QUOTE_TOKEN } from "./mocks";
import { mkTradeModuleStyles } from "./styles";

const TradeModule = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [animateHeight, setAnimateHeight] = useState(true);
  const { position, separatorProps } = useResizableLayout("trade-module", {
    initial: 500,
    max: 600,
    min: 200,
    axis: "y",
    containerRef: contentRef,
  });
  const tradeModuleStyles = mkTradeModuleStyles({ animateHeight });
  const tradeForm = useTradeForm();
  const leverage = useWatch({ control: tradeForm.control, name: "leverage" });
  return (
    <div className={tradeModuleStyles.root}>
      <div className={tradeModuleStyles.header}></div>
      <div className={tradeModuleStyles.content} ref={contentRef}>
        <div
          className={tradeModuleStyles.tradingView}
          style={{
            height: position,
          }}
          onTransitionEnd={() => {
            if (animateHeight) setAnimateHeight(false);
          }}
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
          <Tabs
            stretchTabs
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
              long: (
                <TradeLongForm
                  form={tradeForm}
                  baseTokenList={BASE_TOKENS}
                  quoteToken={QUOTE_TOKEN}
                />
              ),
              short: (
                <TradeShortForm
                  form={tradeForm}
                  baseTokenList={BASE_TOKENS}
                  quoteToken={QUOTE_TOKEN}
                />
              ),
            }}
          />
        </div>
        <div className={tradeModuleStyles.sidebarStats}>
          <TradeStats collateralToken={QUOTE_TOKEN} leverage={leverage} />
        </div>
      </div>
    </div>
  );
};

export { TradeModule };
