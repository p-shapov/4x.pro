import type { FC } from "react";

import type { Coin } from "@4x.pro/app-config";
import { Icon } from "@4x.pro/ui-kit/icon";

import { AssetItem } from "./asset-item";
import { mkAssetsToolbarStyles } from "./styles";
import { useTradeModule } from "../store";

type Props = {
  onChange?: (asset: Coin) => void;
};

const AssetsToolbar: FC<Props> = ({ onChange }) => {
  const assetsToolbarStyles = mkAssetsToolbarStyles();
  const favorites = useTradeModule((state) => state.favorites);
  return (
    <div className={assetsToolbarStyles.root}>
      <Icon src="/icons/star-filled.svg" className={assetsToolbarStyles.icon} />
      {favorites?.map((pair) => (
        <AssetItem key={pair} coin={pair} onChange={onChange} />
      ))}
    </div>
  );
};

export { AssetsToolbar };
