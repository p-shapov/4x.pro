import classNames from "classnames";
import type { FC } from "react";

import { getTokenSymbol } from "@4x.pro/configs/dex-platform";
import type { Token } from "@4x.pro/configs/dex-platform";
import { Icon } from "@4x.pro/ui-kit/icon";

import { mkAssetItemStyles } from "./styles";
import { useTradeModule } from "../store";

type Props = {
  token: Token;
  onChange?: (token: Token) => void;
};

const AssetItem: FC<Props> = ({ token, onChange }) => {
  const assetItemStyles = mkAssetItemStyles();
  const { selectAsset, toggleFavorite, isFavorite } = useTradeModule(
    (state) => ({
      selectAsset: state.selectAsset,
      toggleFavorite: state.toggleFavorite,
      isFavorite: state.favorites.includes(token),
    }),
  );
  const handleSelect = () => {
    selectAsset(token);
    onChange?.(token);
  };
  const handleToggleFavorite = () => {
    toggleFavorite(token);
  };

  return (
    <li className={assetItemStyles.option}>
      <button type="button" onClick={handleToggleFavorite}>
        <Icon
          className={classNames(assetItemStyles.star, {
            [assetItemStyles.starActive]: isFavorite,
            [assetItemStyles.starInactive]: !isFavorite,
          })}
          src={isFavorite ? "/icons/star-filled.svg" : "/icons/star.svg"}
        />
      </button>
      <button type="button" onClick={handleSelect}>
        {getTokenSymbol(token)}
      </button>
    </li>
  );
};

export { AssetItem };
