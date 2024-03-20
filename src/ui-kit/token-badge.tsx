import cn from "classnames";
import type { FC } from "react";

import type { Token } from "@4x.pro/configs/token-config";
import { tokenConfig } from "@4x.pro/configs/token-config";
import { Network } from "@4x.pro/configs/wallet-adapter-config";
import { useWatchTokenInfo } from "@4x.pro/shared/hooks/use-token-info";
import { mkTokenStyles } from "@4x.pro/shared/styles/token-badge";
import type { PropsWithStyles } from "@4x.pro/shared/types";
import { formatPercentage } from "@4x.pro/shared/utils/number";

import { Icon } from "./icon";

type Props = {
  token: Token;
  showNetwork?: boolean;
  showDir?: boolean;
};

const TokenBadge: FC<
  Omit<PropsWithStyles<Props, typeof mkTokenStyles>, "dir">
> = ({ token, showNetwork, showDir, bold = true, gap = 4 }) => {
  const tokenInfo = useWatchTokenInfo(token, showNetwork);
  const { price = 0, previousPrice = 0 } = tokenInfo?.priceData || {};
  const changePercentage = (price - previousPrice) / previousPrice;
  const dir = changePercentage > 0 ? "up" : "down";
  const tokenStyles = mkTokenStyles({ dir, bold, gap });
  return (
    <span className={tokenStyles.root}>
      <img
        src={tokenConfig.TokenLogos[token] || "/tokens/fallback.svg"}
        alt={token}
        width={16}
        height={16}
      />
      <span className={tokenStyles.info}>
        <span className={tokenStyles.symbol}>{token}</span>
        {showNetwork && <span className={tokenStyles.network}>{Network}</span>}
      </span>
      {showDir && changePercentage && (
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
