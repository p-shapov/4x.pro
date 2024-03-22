import cn from "classnames";
import type { FC } from "react";

import type { Token } from "@4x.pro/configs/token-config";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-price-feed";
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
      <TokenBadge
        token={coin}
        priceData={{
          price: priceData.price,
          previousPrice: priceData.price * 0.9,
        }}
      />
    </button>
  );
};

export { AssetItem };
