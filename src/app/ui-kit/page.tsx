"use client";
import cn from "classnames";
import type { FC } from "react";

import { PositionsTable } from "@promo-shock/components/positions-table";
import { mkLayoutStyles } from "@promo-shock/shared/styles/layout";
import { formatRate } from "@promo-shock/shared/utils/number";
import { Button } from "@promo-shock/ui-kit/button";
import { Comparison } from "@promo-shock/ui-kit/comparison";
import { Definition } from "@promo-shock/ui-kit/definition";
import { Link } from "@promo-shock/ui-kit/link";
import { PresetButton } from "@promo-shock/ui-kit/preset-button";
import { RangeSlider } from "@promo-shock/ui-kit/range-slider";
import { Tabs } from "@promo-shock/ui-kit/tabs";
import { Token } from "@promo-shock/ui-kit/token";
import { TokenField } from "@promo-shock/ui-kit/token-field";

const layoutStyles = mkLayoutStyles();

const RootPage: FC = () => {
  return (
    <div className="grid gap-[32px] p-[32px]">
      <div className="grid gap-[32px] w-[320px]">
        <Button type="button" variant="accent">
          Hello, World!
        </Button>
        <Button type="button" variant="primary">
          Hello, World!
        </Button>
        <Button type="button" variant="accent" outlined>
          Hello, World!
        </Button>
        <Button type="button" variant="primary" outlined>
          Hello, World!
        </Button>
        <TokenField
          placeholder="Enter a number"
          tokenList={[
            {
              account: "1",
              symbol: "Token 1",
              uri: "https://placeholder.com/16x16",
            },
            {
              account: "2",
              symbol: "Token 2",
              uri: "https://placeholder.com/16x16",
            },
            {
              account: "3",
              symbol: "Token 3",
              uri: "https://placeholder.com/16x16",
            },
            {
              account: "4",
              symbol: "Token 4",
              uri: "https://placeholder.com/16x16",
            },
          ]}
        />
        <RangeSlider formatValue={formatRate} />
        <div className="flex gap-[10px]">
          <PresetButton value={100} formatValue={formatRate} />
          <PresetButton value={75} formatValue={formatRate} />
          <PresetButton value={50} formatValue={formatRate} />
          <PresetButton value={25} formatValue={formatRate} />
        </div>
        <dl
          className={cn(
            layoutStyles.cardSurface,
            layoutStyles.cardPaddings,
            "grid",
            "gap-[8px]",
          )}
        >
          <Definition
            term="Collateral"
            content={
              <Token
                symbol="USDC"
                uri="https://placeholder.com/16x16"
                tradeDir="down"
                percentage={5}
                gap={8}
                bold={false}
              />
            }
          />
          <Definition
            term="Leverage"
            content={
              <Comparison initial={5} final={10} formatValue={formatRate} />
            }
          />
        </dl>

        <Link text="Trade" iconSrc="/icons/status-up.svg" size="lg" uppercase />
        <Link
          text="Earn"
          iconSrc="/icons/arrange-square.svg"
          size="lg"
          uppercase
        />
        <Link
          text="Hello, World!"
          variant="accent"
          iconSrc="/icons/setting-2.svg"
        />
        <Link
          text="Hello, World!"
          variant="red"
          iconSrc="/icons/close-circle.svg"
        />
      </div>
      <div className={cn("w-max", layoutStyles.cardSurface)}>
        <Tabs
          items={[
            {
              id: "positions",
              content: (
                <div className={layoutStyles.cardPaddings}>Positions</div>
              ),
            },
            {
              id: "orders",
              content: <div className={layoutStyles.cardPaddings}>Orders</div>,
            },
          ]}
          panels={{
            positions: (
              <div className={layoutStyles.cardPaddings}>
                <PositionsTable
                  items={[
                    {
                      txHash: "1",
                      token: {
                        account: "1",
                        symbol: "Token 1",
                        network: "solana",
                        uri: "https://placeholder.com/16x16",
                      },
                      side: "short",
                      leverage: 5,
                      size: 100,
                      collateral: 1000,
                      pnl: 100,
                      entryPrice: 100,
                      markPrice: 100,
                      liquidationPrice: 100,
                    },
                    {
                      txHash: "2",
                      token: {
                        account: "2",
                        symbol: "Token 2",
                        network: "solana",
                        uri: "https://placeholder.com/16x16",
                      },
                      side: "long",
                      leverage: 5,
                      size: 100,
                      collateral: 1000,
                      pnl: 100,
                      entryPrice: 100,
                      markPrice: 100,
                      liquidationPrice: 100,
                    },
                    {
                      txHash: "3",
                      token: {
                        account: "3",
                        symbol: "Token 3",
                        network: "solana",
                        uri: "https://placeholder.com/16x16",
                      },
                      side: "short",
                      leverage: 5,
                      size: 100,
                      collateral: 1000,
                      pnl: 100,
                      entryPrice: 100,
                      markPrice: 100,
                      liquidationPrice: 100,
                    },
                    {
                      txHash: "4",
                      token: {
                        account: "4",
                        symbol: "Token 4",
                        network: "solana",
                        uri: "https://placeholder.com/16x16",
                      },
                      side: "long",
                      leverage: 5,
                      size: 100,
                      collateral: 1000,
                      pnl: 100,
                      entryPrice: 100,
                      markPrice: 100,
                      liquidationPrice: 100,
                    },
                  ]}
                  onManage={() => {}}
                  onClose={() => {}}
                />
              </div>
            ),
            orders: <div className={layoutStyles.cardPaddings}>Orders</div>,
          }}
        />
      </div>
    </div>
  );
};

export default RootPage;
