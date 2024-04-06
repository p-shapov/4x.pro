import { PositionsTable } from "@4x.pro/components/positions-table";
import { useUserPositions } from "@4x.pro/services/perpetuals/hooks/use-positions";

const UserPositions = () => {
  const { data: positions } = useUserPositions();
  if (!positions) return null;
  return <PositionsTable items={Object.values(positions)} />;
};

export { UserPositions };
