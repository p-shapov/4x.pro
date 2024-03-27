"use client";
import { offset, useFloating } from "@floating-ui/react-dom";
import { Listbox } from "@headlessui/react";
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
  const { refs, floatingStyles } = useFloating({
    placement: "bottom-end",
    middleware: [offset({ mainAxis: 8, crossAxis: 40 })],
    strategy: "fixed",
  });
  const assetSelectorStyles = mkAssetSelectorStyles();
  const { selectedAsset, selectAsset } = useTradeModule((state) => ({
    selectedAsset: state.selectedAsset,
    selectAsset: state.selectAsset,
  }));
  const handleChange = (asset: Token) => {
    onChange?.(asset);
    selectAsset(asset);
  };
  return (
    <Listbox
      as="div"
      className={assetSelectorStyles.root}
      onChange={handleChange}
    >
      <Listbox.Button className={assetSelectorStyles.button}>
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
              ref={refs.setReference}
              src={open ? "/icons/arrow-up-1.svg" : "/icons/arrow-down-1.svg"}
              className={assetSelectorStyles.icon}
            />
          </>
        )}
      </Listbox.Button>
      <Listbox.Options
        as="ul"
        ref={refs.setFloating}
        className={assetSelectorStyles.options}
        style={floatingStyles}
      >
        <span className={assetSelectorStyles.optionsArrow}></span>
        {assetList.map((token) => (
          <AssetItem key={token} token={token} />
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

export { AssetSelector };