import type { ComponentProps } from "react";

import type { PositionsTable } from "@4x.pro/components/positions-table";

const POSITIONS: ComponentProps<typeof PositionsTable>["items"] = [
  {
    id: "1",
    collateralToken: "SOL",
    side: "long",
    leverage: 3,
    collateral: 0.0519,
    entryPrice: 95.8,
  },
  {
    id: "2",
    collateralToken: "BTC",
    side: "short",
    leverage: 5,
    collateral: 0.0001,
    entryPrice: 66000,
  },
  {
    id: "3",
    collateralToken: "ETH",
    side: "long",
    leverage: 3,
    collateral: 0.5,
    entryPrice: 3500,
  },
];

export { POSITIONS };
