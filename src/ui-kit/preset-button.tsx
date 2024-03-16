import type { FC } from "react";

import { mkBadgeStyles } from "@promo-shock/shared/styles/badge";
import type { Formatter } from "@promo-shock/shared/utils/number";
import { formatIdentity } from "@promo-shock/shared/utils/number";

type Props = {
  value: number;
  formatValue?: Formatter;
  onClick?: () => void;
};

const PresetButton: FC<Props> = ({
  value,
  formatValue = formatIdentity,
  ...rest
}) => {
  const badgeStyles = mkBadgeStyles();
  return (
    <button type="button" className={badgeStyles.root} {...rest}>
      {formatValue(value)}
    </button>
  );
};

export { PresetButton };
