import cn from "classnames";
import type { FC } from "react";

import { mkTokenStyles } from "@promo-shock/shared/styles/token";
import type { PropsWithStyles } from "@promo-shock/shared/types";
import { formatPercentage } from "@promo-shock/shared/utils/number";

import { Icon } from "./icon";

type Props = {
  symbol: string;
  uri: string;
  percentage?: number;
  network?: string;
};

const Token: FC<PropsWithStyles<Props, typeof mkTokenStyles>> = ({
  symbol,
  uri,
  tradeDir,
  percentage,
  network,
  bold = true,
  gap = 4,
}) => {
  const tokenStyles = mkTokenStyles({ tradeDir, bold, gap });
  return (
    <span className={tokenStyles.root}>
      <img src={uri} alt={symbol} width={16} height={16} />
      <span className={tokenStyles.info}>
        <span className={tokenStyles.symbol}>{symbol}</span>
        {network && <span className={tokenStyles.network}>{network}</span>}
      </span>
      {tradeDir && (
        <span className={tokenStyles.tradeDir}>
          <Icon
            className={tokenStyles.icon}
            src={
              tradeDir === "up"
                ? "/icons/arrow-up.svg"
                : "/icons/arrow-down.svg"
            }
          />
          {percentage && (
            <span className={cn(tokenStyles.percentage)}>
              {formatPercentage(percentage, 1)}
            </span>
          )}
        </span>
      )}
    </span>
  );
};

export { Token };
