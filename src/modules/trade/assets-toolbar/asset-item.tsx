import cn from "classnames";
import type { FC } from "react";

import type { Token } from "@4x.pro/app-config";
import { useToken24hrBenchmark } from "@4x.pro/shared/hooks/use-token-24hr-benchbark";
import { TokenBadge } from "@4x.pro/ui-kit/token-badge";

import { mkAssetItemStyles } from "./styles";
import { useTradeModule } from "../store";

type Props = {
  coin: Token;
  onChange?: (asset: Token) => void;
};

const AssetItem: FC<Props> = ({ onChange, coin }) => {
  const assetItemStyles = mkAssetItemStyles();
  const { data: benchmark24hr } = useToken24hrBenchmark({ token: coin });
  const change24hr = benchmark24hr
    ? (benchmark24hr.change / benchmark24hr.close) * 100
    : undefined;
  const { selectedAsset, selectAsset } = useTradeModule((state) => ({
    selectedAsset: state.selectedAsset,
    selectAsset: state.selectAsset,
  }));
  const handleSelect = () => {
    selectAsset(coin);
    onChange?.(coin);
  };
  return (
    <button
      type="button"
      onClick={handleSelect}
      className={cn(assetItemStyles.asset, {
        [assetItemStyles.activeAsset]: coin === selectedAsset,
        [assetItemStyles.inactiveAsset]: coin !== selectedAsset,
      })}
    >
      <TokenBadge token={coin} priceChange={change24hr || 0} />
    </button>
  );
};

export { AssetItem };
