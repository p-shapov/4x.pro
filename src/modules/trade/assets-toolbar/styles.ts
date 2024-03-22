import cn from "classnames";

import { mkLayoutStyles } from "@4x.pro/shared/styles/layout";

const mkAssetItemStyles = () => {
  return {
    asset: cn(
      "flex",
      "p-[8px]",
      "rounded-[1.2rem]",
      "transition-colors",
      "items-center",
    ),
    activeAsset: cn("bg-strong"),
    inactiveAsset: cn("bg-transparent"),
  };
};

const mkAssetsToolbarStyles = () => {
  const layoutStyles = mkLayoutStyles();
  return {
    root: cn(
      layoutStyles.cardSurface,
      "col-[1/3]",
      "rounded-[3.2rem]",
      "flex",
      "items-center",
      "gap-[4px]",
      "px-[0.8rem]",
      "h-[3.2rem]",
    ),
    icon: cn("w-[2rem]", "h-[2rem]", "mr-[4px]", "text-content-3"),
  };
};

export { mkAssetsToolbarStyles, mkAssetItemStyles };
