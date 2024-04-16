import cn from "classnames";
import type { FC } from "react";

import {
  getTokenLogo,
  getTokenNetwork,
  getTokenSymbol,
} from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";
import { mkTokenStyles } from "@4x.pro/shared/styles/token-badge";
import type { PropsWithStyles } from "@4x.pro/shared/types";
import { formatPercentage } from "@4x.pro/shared/utils/number";

import { Icon } from "./icon";

type Props = {
  token: Token;
  showNetwork?: boolean;
  priceChange?: number;
};

const TokenBadge: FC<
  Omit<PropsWithStyles<Props, typeof mkTokenStyles>, "dir">
> = ({ token, showNetwork, priceChange, bold = true, gap = 4 }) => {
  const dir =
    (priceChange || 0) > 0 ? "up" : (priceChange || 0) < 0 ? "down" : undefined;
  const tokenStyles = mkTokenStyles({ dir, bold, gap });
  return (
    <span className={tokenStyles.root}>
      {token !== "LP" && (
        <img src={getTokenLogo(token)} alt={token} width={16} height={16} />
      )}
      <span className={tokenStyles.info}>
        <span className={tokenStyles.symbol}>{getTokenSymbol(token)}</span>
        {showNetwork && (
          <span className={tokenStyles.network}>{getTokenNetwork(token)}</span>
        )}
      </span>
      {priceChange && (
        <span className={tokenStyles.tradeDir}>
          <Icon
            className={tokenStyles.icon}
            src={dir === "up" ? "/icons/arrow-up.svg" : "/icons/arrow-down.svg"}
          />
          <span className={cn(tokenStyles.percentage)}>
            {formatPercentage(priceChange, 2)}
          </span>
        </span>
      )}
    </span>
  );
};

export { TokenBadge };
