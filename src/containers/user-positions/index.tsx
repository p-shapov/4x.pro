import { PositionsTable } from "@4x.pro/components/positions-table";

import { POSITIONS } from "./mocks";

const UserPositions = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PositionsTable items={POSITIONS as any} />;
};

export { UserPositions };
