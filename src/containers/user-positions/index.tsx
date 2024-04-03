import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { PositionsTable } from "@4x.pro/components/positions-table";
import { useUserPositions } from "@4x.pro/services/perpetuals/hooks/use-positions";
import { Side } from "@4x.pro/services/perpetuals/lib/types";

const UserPositions = () => {
  const { data: positions } = useUserPositions();
  if (!positions) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    <PositionsTable
      items={Object.values(positions).map((position) => {
        const collateral =
          position.collateralAmount.toNumber() / LAMPORTS_PER_SOL;
        return {
          collateral,
          entryPrice: position.getPrice(),
          id: position.address.toBase58(),
          collateralToken: position.token,
          leverage: position.getLeverage(),
          side: position.side === Side.Long ? "long" : "short",
        };
      })}
    />
  );
};

export { UserPositions };
