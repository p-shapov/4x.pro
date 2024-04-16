import type { FC } from "react";

import type { CustodyAccount } from "@4x.pro/services/perpetuals/lib/custody-account";
import type { PoolAccount } from "@4x.pro/services/perpetuals/lib/pool-account";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-connection";
import {
  formatCurrency_USD,
  formatPercentage,
} from "@4x.pro/shared/utils/number";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";

import { mkDistributionRowStyles } from "./styles";

type Props = {
  pool: PoolAccount;
  custody: CustodyAccount;
};

const DistributionRow: FC<Props> = ({ pool, custody }) => {
  const distributionRowStyles = mkDistributionRowStyles();
  const token = custody.getToken();
  // const amount = custody.getAmount();
  const { priceData } = useWatchPythPriceFeed(token) || {};
  const liquidity =
    priceData?.price && custody.getCustodyLiquidity(priceData.price);
  const custodyAmount = Number(custody.assets.owned) / 10 ** custody.decimals;
  const liquidities = pool.getLiquidities();
  const weight =
    liquidities && priceData?.price
      ? (100 * custodyAmount * priceData?.price) / liquidities
      : 0;
  const target = Number(pool.getRatioStruct(custody.address).target);
  const utilization = custody.getUtilizationRate();
  if (!token) return null;
  return (
    <tr className={distributionRowStyles.root}>
      <td className={distributionRowStyles.cell}>
        <TokenBadge token={token} />
      </td>
      <td className={distributionRowStyles.cell}>
        {formatCurrency_USD(priceData?.price, 2)}
      </td>
      <td className={distributionRowStyles.cell}>
        {formatCurrency_USD(liquidity, 2)}
      </td>
      <td className={distributionRowStyles.cell}>
        {formatPercentage(weight, 2)} / {formatPercentage(target / 100, 2)}
      </td>
      <td className={distributionRowStyles.cell}>
        {formatPercentage(utilization, 2)}
      </td>
    </tr>
  );
};

export { DistributionRow };
