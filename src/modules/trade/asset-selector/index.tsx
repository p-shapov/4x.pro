import { Popover } from "@headlessui/react";
import type { FC } from "react";

import type { Token } from "@4x.pro/configs/dex-platform";
import { getTokenLogo, getTokenSymbol } from "@4x.pro/configs/dex-platform";
import { formatRate } from "@4x.pro/shared/utils/number";
import { Icon } from "@4x.pro/ui-kit/icon";

import { AssetItem } from "./asset-item";
import { mkAssetSelectorStyles } from "./styles";
import { useTradeModule } from "../store";

type Props = {
  onChange?: (asset: Token) => void;
};

const assetList: Token[] = ["SOL", "BTC", "ETH"];

const AssetSelector: FC<Props> = ({ onChange }) => {
  const assetSelectorStyles = mkAssetSelectorStyles();
  const { selectedAsset } = useTradeModule((state) => ({
    selectedAsset: state.selectedAsset,
  }));
  const mkHandleChange = (asset: Token, close: () => void) => () => {
    onChange?.(asset);
    close();
  };
  return (
    <Popover className={assetSelectorStyles.root}>
      <Popover.Button className={assetSelectorStyles.button}>
        {({ open }) => (
          <>
            <img
              src={getTokenLogo(selectedAsset)}
              alt={selectedAsset}
              width={20}
              height={20}
            />
            <span>{getTokenSymbol(selectedAsset)}/USDC</span>
            <span className={assetSelectorStyles.leverage}>
              {formatRate(100)}
            </span>
            <Icon
              src={open ? "/icons/arrow-up-1.svg" : "/icons/arrow-down-1.svg"}
              className={assetSelectorStyles.icon}
            />
          </>
        )}
      </Popover.Button>
      <Popover.Panel className={assetSelectorStyles.panel}>
        {({ close }) => (
          <ul className={assetSelectorStyles.options}>
            {assetList.map((token) => (
              <AssetItem
                key={token}
                token={token}
                onChange={mkHandleChange(token, close)}
              />
            ))}
          </ul>
        )}
      </Popover.Panel>
    </Popover>
  );
};

export { AssetSelector };
