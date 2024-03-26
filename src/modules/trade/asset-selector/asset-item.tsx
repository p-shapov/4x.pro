import { Listbox } from "@headlessui/react";
import cn from "classnames";
import type { FC, MouseEventHandler } from "react";

import {
  getTokenLogo,
  getTokenNetwork,
  getTokenSymbol,
} from "@4x.pro/configs/dex-platform";
import type { Token } from "@4x.pro/configs/dex-platform";
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
            <TokenPrice token={token} fractionalDigits={2} />
          </span>
          <span
            className={cn(assetItemStyles.change, {
              [assetItemStyles.changePositive]: true,
              [assetItemStyles.changeNegative]: false,
            })}
          >
            +0.12%
          </span>
        </div>
      </div>
    </Listbox.Option>
  );
};

export { AssetItem };
