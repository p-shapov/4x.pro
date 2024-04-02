import cn from "classnames";
import type { FC } from "react";

import type { Token } from "@4x.pro/app-config";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-connection";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";

import { mkAssetItemStyles } from "./styles";
import { useTradeModule } from "../store";

type Props = {
  coin: Token;
  onChange?: (asset: Token) => void;
};

const AssetItem: FC<Props> = ({ onChange, coin }) => {
  const assetItemStyles = mkAssetItemStyles();
  const { priceData } = useWatchPythPriceFeed(coin);
  const { selectedAsset, selectAsset } = useTradeModule((state) => ({
    selectedAsset: state.selectedAsset,
    selectAsset: state.selectAsset,
  }));
  const handleSelect = () => {
    selectAsset(coin);
    onChange?.(coin);
  };
  if (!priceData || !priceData.price) return null;
  return (
    <button
      type="button"
      onClick={handleSelect}
      className={cn(assetItemStyles.asset, {
        [assetItemStyles.activeAsset]: coin === selectedAsset,
        [assetItemStyles.inactiveAsset]: coin !== selectedAsset,
      })}
    >
      <TokenBadge token={coin} priceChange={0.12} />
    </button>
  );
};

export { AssetItem };
