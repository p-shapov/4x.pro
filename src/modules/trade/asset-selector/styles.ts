import cn from "classnames";

import { mkBadgeStyles } from "@4x.pro/shared/styles/badge";

const mkAssetItemStyles = () => {
  return {
    option: cn("cursor-pointer", "px-[1.2rem]", "group/asset-option"),
    item: cn(
      "flex",
      "gap-[0.8rem]",
      "py-[0.8rem]",
      "items-center",
      "border-b-[1px]",
      "border-content-3",
      "group-last/asset-option:border-none",
    ),
    logo: cn("size-[2.8rem]", "mr-[0.2rem]"),
    info: cn(
      "flex-1",
      "grid",
      "grid-rows-[max-content_max-content]",
      "grid-cols-[max-content_max-content]",
      "justify-between",
    ),
    symbol: cn("text-h6", "col-[1]", "row-[1]", "text-content-1"),
    network: cn("text-body-12", "col-[1]", "row-[2]", "text-content-2"),
    price: cn(
      "text-h6",
      "col-[2]",
      "row-[1]",
      "text-content-1",
      "justify-self-end",
    ),
    change: cn("text-h6", "col-[2]", "row-[2]", "justify-self-end"),
    changePositive: cn("text-green"),
    changeNegative: cn("text-red"),
    star: cn("size-[1.6rem]", "transition-colors"),
    starActive: cn("text-accent"),
    starInactive: cn("text-content-3"),
  };
};

const mkAssetSelectorStyles = () => {
  const badgeStyles = mkBadgeStyles();
  return {
    root: cn(),
    button: cn(
      "flex",
      "gap-[4px]",
      "items-center",
      "cursor-pointer",
      "text-h5",
      "text-content-1",
      "outline-none",
    ),
    leverage: cn(
      badgeStyles.root,
      "bg-strong",
      "bg-opacity-100",
      "text-primary",
    ),
    icon: cn("size-[2rem]", "ml-[12px]"),
    options: cn(
      "grid",
      "w-[240px]",
      "z-[1000]",
      "bg-dialog",
      "rounded-[16px]",
      "py-[4px]",
    ),
    optionsArrow: cn(
      "absolute",
      "bottom-[calc(100%-8px)]",
      "right-[44px]",
      "size-[12px]",
      "bg-dialog",
      "rotate-45",
    ),
  };
};

export { mkAssetSelectorStyles, mkAssetItemStyles };
