import { Listbox } from "@headlessui/react";
import cn from "classnames";
import type { FC, MouseEventHandler } from "react";

import {
  getTokenLogo,
  getTokenNetwork,
  getTokenSymbol,
} from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";
import { useToken24hrBenchmark } from "@4x.pro/shared/hooks/use-token-24hr-benchbark";
import { formatPercentage } from "@4x.pro/shared/utils/number";
import { Icon } from "@4x.pro/ui-kit/icon";
import { TokenPrice } from "@4x.pro/ui-kit/token-price";

import { mkAssetItemStyles } from "./styles";
import { useTradeModule } from "../store";

type Props = {
  token: Token;
};

const AssetItem: FC<Props> = ({ token }) => {
  const assetItemStyles = mkAssetItemStyles();
  const { toggleFavorite, isFavorite } = useTradeModule((state) => ({
    selectAsset: state.selectAsset,
    toggleFavorite: state.toggleFavorite,
    isFavorite: state.favorites.includes(token),
  }));
  const { data: benchmark24hr } = useToken24hrBenchmark({ token });
  const change24hr = benchmark24hr
    ? (benchmark24hr.change / benchmark24hr.close) * 100
    : undefined;
  const handleToggleFavorite: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    toggleFavorite(token);
  };
  return (
    <Listbox.Option as="li" value={token} className={assetItemStyles.option}>
      <div className={assetItemStyles.item}>
        <button type="button" onClick={handleToggleFavorite}>
          <Icon
            className={cn(assetItemStyles.star, {
              [assetItemStyles.starActive]: isFavorite,
              [assetItemStyles.starInactive]: !isFavorite,
            })}
            src={isFavorite ? "/icons/star-filled.svg" : "/icons/star.svg"}
          />
        </button>
        <img
          className={assetItemStyles.logo}
          src={getTokenLogo(token)}
          alt={token}
          width={28}
          height={28}
        />
        <div className={assetItemStyles.info}>
          <span className={assetItemStyles.symbol}>
            {getTokenSymbol(token)}
          </span>
          <span className={assetItemStyles.network}>
            {getTokenNetwork(token)}
          </span>
          <span className={assetItemStyles.price}>
            <TokenPrice token={token} fractionalDigits={2} watch />
          </span>
          {change24hr && (
            <span
              className={cn(assetItemStyles.change, {
                [assetItemStyles.changePositive]: (change24hr || 0) > 0,
                [assetItemStyles.changeNegative]: (change24hr || 0) < 0,
              })}
            >
              {change24hr > 0 ? "+" : change24hr < 0 ? "-" : ""}
              {formatPercentage(Math.abs(change24hr), 2)}
            </span>
          )}
        </div>
      </div>
    </Listbox.Option>
  );
};

export { AssetItem };
