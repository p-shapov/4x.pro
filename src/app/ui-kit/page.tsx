"use client";
import cn from "classnames";
import type { FC } from "react";
import { useWatch } from "react-hook-form";

import { PositionsTable } from "@promo-shock/components/positions-table";
import { TradeForm, useTradeForm } from "@promo-shock/components/trade-form";
import { TradeStats } from "@promo-shock/components/trade-stats";
import { mkLayoutStyles } from "@promo-shock/shared/styles/layout";
import { Tabs } from "@promo-shock/ui-kit/tabs";

import { BASE_TOKENS, POSITIONS, QUOTE_TOKEN } from "./mocks";

const layoutStyles = mkLayoutStyles();

const RootPage: FC = () => {
  const tradeForm = useTradeForm();
  const leverage = useWatch({ control: tradeForm.control, name: "leverage" });
  return (
    <div className="grid gap-[1.2rem] p-[3.2rem]">
      <div className={cn(layoutStyles.cardSurface, "grid", "w-[27.5rem]")}>
        <Tabs
          stretchTabs
          items={[
            {
              id: "long",
              content: <div className={layoutStyles.cardPaddings}>Long</div>,
            },
            {
              id: "short",
              content: <div className={layoutStyles.cardPaddings}>Short</div>,
            },
          ]}
          panels={{
            long: (
              <div className={layoutStyles.cardPaddings}>
                <TradeForm
                  form={tradeForm}
                  title="Long/Buy"
                  baseTokenList={BASE_TOKENS}
                  quoteToken={QUOTE_TOKEN}
                />
              </div>
            ),
            short: (
              <div className={layoutStyles.cardPaddings}>
                <TradeForm
                  form={tradeForm}
                  title="Short/Sell"
                  baseTokenList={BASE_TOKENS}
                  quoteToken={QUOTE_TOKEN}
                />
              </div>
            ),
          }}
        />
      </div>
      <div
        className={cn(
          layoutStyles.cardSurface,
          layoutStyles.cardPaddings,
          "grid w-[270px]",
        )}
      >
        <TradeStats
          collateralToken={{
            account: "SOL_account",
            symbol: "SOL",
          }}
          leverage={leverage}
        />
      </div>
      <div className={cn("w-max", layoutStyles.cardSurface)}>
        <Tabs
          items={[
            {
              id: "positions",
              content: (
                <div className={layoutStyles.cardPaddings}>
                  <span className="px-[0.4rem]">Positions</span>
                </div>
              ),
            },
            {
              id: "orders",
              content: (
                <div className={layoutStyles.cardPaddings}>
                  <span className="px-[0.4rem]">Orders</span>
                </div>
              ),
            },
          ]}
          panels={{
            positions: (
              <div
                className={cn(
                  layoutStyles.cardPaddings,
                  "h-[250px]",
                  "pb-[0px]",
                )}
              >
                <PositionsTable
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  items={POSITIONS as any}
                  onManage={() => {}}
                  onClose={() => {}}
                />
              </div>
            ),
            orders: (
              <div
                className={cn(
                  layoutStyles.cardPaddings,
                  "h-[250px]",
                  "pb-[0px]",
                )}
              >
                <PositionsTable
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  items={POSITIONS as any}
                  onManage={() => {}}
                  onClose={() => {}}
                />
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default RootPage;
