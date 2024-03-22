import cn from "classnames";

import { mkBadgeStyles } from "@4x.pro/shared/styles/badge";

const mkAssetItemStyles = () => {
  return {
    option: cn("flex", "gap-[8px]", "text-h5", "items-center"),
    star: cn("size-[1.6rem]", "transition-colors"),
    starActive: cn("text-accent"),
    starInactive: cn("text-content-3"),
  };
};

const mkAssetSelectorStyles = () => {
  const badgeStyles = mkBadgeStyles();
  return {
    root: cn("relative"),
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
    panel: cn(
      "absolute",
      "top-[calc(100%+5px)]",
      "left-0",
      "w-[300px]",
      "z-[1000]",
      "p-[24px]",
      "bg-card",
    ),
    options: cn("grid", "gap-[10px]"),
  };
};

export { mkAssetSelectorStyles, mkAssetItemStyles };
