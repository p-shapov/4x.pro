import cn from "classnames";

import { mkBadgeStyles } from "./badge";

const mkPresetsStyles = () => {
  const badgeStyles = mkBadgeStyles();
  return {
    root: cn("flex", "gap-[0.4rem]"),
    option: cn(badgeStyles.root, "cursor-pointer"),
  };
};

export { mkPresetsStyles };
