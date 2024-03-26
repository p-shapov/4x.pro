import cn from "classnames";
import type { FC } from "react";

import {
  getTokenLogo,
  getTokenNetwork,
  getTokenSymbol,
} from "@4x.pro/configs/dex-platform";
import type { Token } from "@4x.pro/configs/dex-platform";
import { mkTokenStyles } from "@4x.pro/shared/styles/token-badge";
import type { PropsWithStyles } from "@4x.pro/shared/types";
import { formatPercentage } from "@4x.pro/shared/utils/number";

import { Icon } from "./icon";

type Props = {
  token: Token;
  showNetwork?: boolean;
  priceData?: {
    price: number;
    previousPrice: number;
  };
};

const TokenBadge: FC<
  Omit<PropsWithStyles<Props, typeof mkTokenStyles>, "dir">
> = ({ token, showNetwork, priceData, bold = true, gap = 4 }) => {
  const changePercentage = priceData
    ? (priceData.price - priceData.previousPrice) / priceData.previousPrice
    : undefined;
  const dir =
    typeof changePercentage === "number"
      ? changePercentage > 0
        ? "up"
        : "down"
      : undefined;
  const tokenStyles = mkTokenStyles({ dir, bold, gap });
  return (
    <span className={tokenStyles.root}>
      <img src={getTokenLogo(token)} alt={token} width={16} height={16} />
      <span className={tokenStyles.info}>
        <span className={tokenStyles.symbol}>{getTokenSymbol(token)}</span>
        {showNetwork && (
          <span className={tokenStyles.network}>{getTokenNetwork(token)}</span>
        )}
      </span>
      {changePercentage && (
        <span className={tokenStyles.tradeDir}>
          <Icon
            className={tokenStyles.icon}
            src={dir === "up" ? "/icons/arrow-up.svg" : "/icons/arrow-down.svg"}
          />
          {changePercentage && (
            <span className={cn(tokenStyles.percentage)}>
              {formatPercentage(changePercentage, 1)}
            </span>
          )}
        </span>
      )}
    </span>
  );
};

export { TokenBadge };
