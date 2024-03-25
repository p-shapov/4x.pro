import type { FC } from "react";

import { mkStatusIconStyles } from "@4x.pro/shared/styles/status-icon";
import type { PropsWithStyles } from "@4x.pro/shared/types";

import { Icon } from "./icon";

const StatusIcon: FC<PropsWithStyles<object, typeof mkStatusIconStyles>> = ({
  type,
}) => {
  const statusIconStyles = mkStatusIconStyles({ type });
  const getIconSrc = () => {
    switch (type) {
      case "success":
        return "/icons/tick.svg" as const;
    }
  };
  return (
    <span className={statusIconStyles.root}>
      <Icon className={statusIconStyles.icon} src={getIconSrc()} />
    </span>
  );
};

export { StatusIcon };
