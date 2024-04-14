import type { FC } from "react";

import type { PoolAccount } from "@4x.pro/services/perpetuals/lib/pool-account";

import { DistributionRow } from "./distribution-row";
import { mkDistributionTableStyles } from "./styles";

type Props = {
  pool: PoolAccount;
};

const DistributionTable: FC<Props> = ({ pool }) => {
  const distributionTableStyles = mkDistributionTableStyles();
  return (
    <table
      className={distributionTableStyles.root}
      style={{
        // @ts-expect-error - CSS variable
        "--tw-table-cols": 5,
      }}
    >
      <thead className={distributionTableStyles.head}>
        <tr className={distributionTableStyles.row}>
          <th className={distributionTableStyles.headingCell}>Token</th>
          <th className={distributionTableStyles.headingCell}>Price</th>
          <th className={distributionTableStyles.headingCell}>Pool</th>
          <th className={distributionTableStyles.headingCell}>
            Weight / Target
          </th>
          <th className={distributionTableStyles.headingCell}>Utilization</th>
        </tr>
      </thead>
      <tbody className={distributionTableStyles.body}>
        {Object.values(pool.custodies).map((custody) => (
          <DistributionRow
            key={custody.address.toString()}
            pool={pool}
            custody={custody}
          />
        ))}
      </tbody>
    </table>
  );
};

export { DistributionTable };
