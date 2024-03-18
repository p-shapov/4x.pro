"use client";

import { useWatch } from "react-hook-form";
import { useResizable } from "react-resizable-layout";

import { useTradeForm } from "@4x.pro/components/trade-form";
import { TradeStats } from "@4x.pro/components/trade-stats";
import { TradeLongForm } from "@4x.pro/containers/trade-long-form";
import { TradeShortForm } from "@4x.pro/containers/trade-short-form";
import { UserBalances } from "@4x.pro/containers/user-balances";
import { UserHistory } from "@4x.pro/containers/user-history";
import { UserOrders } from "@4x.pro/containers/user-orders";
import { UserPositions } from "@4x.pro/containers/user-positions";
import { Tabs } from "@4x.pro/ui-kit/tabs";

import { BASE_TOKENS, QUOTE_TOKEN } from "./mocks";
import { mkTradeModuleStyles } from "./styles";

const TradeModule = () => {
  const { position, separatorProps } = useResizable({
    initial: 500,
    max: 600,
    min: 200,
    axis: "y",
  });
  const tradeModuleStyles = mkTradeModuleStyles();
  const tradeForm = useTradeForm();
  const leverage = useWatch({ control: tradeForm.control, name: "leverage" });
  return (
    <div className={tradeModuleStyles.root}>
      <div
        className={tradeModuleStyles.content}
        style={{
          // @ts-expect-error - CSS variable
          "--tw-trading-view-height": `${position}px`,
        }}
      >
        <div className={tradeModuleStyles.tradingView}>TRADING VIEW</div>
        <div
          className={tradeModuleStyles.contentSeparator}
          {...separatorProps}
        ></div>
        <div className={tradeModuleStyles.tableTabs}>
          <Tabs
            items={[
              {
                id: "positions",
                content: (
                  <div className={tradeModuleStyles.tableTab}>Positions</div>
                ),
              },
              {
                id: "orders",
                content: (
                  <div className={tradeModuleStyles.tableTab}>Orders</div>
                ),
              },
              {
                id: "history",
                content: (
                  <div className={tradeModuleStyles.tableTab}>History</div>
                ),
              },
              {
                id: "balances",
                content: (
                  <div className={tradeModuleStyles.tableTab}>Balances</div>
                ),
              },
            ]}
            panels={{
              positions: (
                <div className={tradeModuleStyles.tableTabPanel}>
                  <UserPositions />
                </div>
              ),
              orders: (
                <div className={tradeModuleStyles.tableTabPanel}>
                  <UserOrders />
                </div>
              ),
              history: (
                <div className={tradeModuleStyles.tableTabPanel}>
                  <UserHistory />
                </div>
              ),
              balances: (
                <div className={tradeModuleStyles.tableTabPanel}>
                  <UserBalances />
                </div>
              ),
            }}
          />
        </div>
      </div>
      <div className={tradeModuleStyles.sidebar}>
        <div className={tradeModuleStyles.sidebarTabs}>
          <Tabs
            stretchTabs
            items={[
              {
                id: "long",
                content: (
                  <div className={tradeModuleStyles.sidebarTab}>Long</div>
                ),
              },
              {
                id: "short",
                content: (
                  <div className={tradeModuleStyles.sidebarTab}>Short</div>
                ),
              },
            ]}
            panels={{
              long: (
                <div className={tradeModuleStyles.sidebarTabPanel}>
                  <TradeLongForm
                    form={tradeForm}
                    baseTokenList={BASE_TOKENS}
                    quoteToken={QUOTE_TOKEN}
                  />
                </div>
              ),
              short: (
                <div className={tradeModuleStyles.sidebarTabPanel}>
                  <TradeShortForm
                    form={tradeForm}
                    baseTokenList={BASE_TOKENS}
                    quoteToken={QUOTE_TOKEN}
                  />
                </div>
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
