"use client";
import cn from "classnames";
import type { FC } from "react";

import { mkLayoutStyles } from "@promo-shock/shared/styles/layout";
import { formatRate } from "@promo-shock/shared/utils/number";
import { Button } from "@promo-shock/ui-kit/button";
import { Comparison } from "@promo-shock/ui-kit/comparison";
import { Definition } from "@promo-shock/ui-kit/definition";
import { PresetButton } from "@promo-shock/ui-kit/preset-button";
import { RangeSlider } from "@promo-shock/ui-kit/range-slider";
import { Token } from "@promo-shock/ui-kit/token";
import { TokenField } from "@promo-shock/ui-kit/token-field";

const layoutStyles = mkLayoutStyles();

const RootPage: FC = () => {
  return (
    <div className="grid p-[32px] gap-[32px] w-[320px]">
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
    </div>
  );
};

export default RootPage;
