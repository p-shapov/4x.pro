import type { ComponentProps, FC } from "react";

import { mkIconButtonStyles } from "@4x.pro/shared/styles/button";
import type { PropsWithStyles } from "@4x.pro/shared/types";

import { Icon } from "./icon";

type Props = {
  onClick?: () => void;
} & Pick<ComponentProps<typeof Icon>, "src">;

const IconButton: FC<PropsWithStyles<Props, typeof mkIconButtonStyles>> = ({
  src,
  variant,
  onClick,
  outlined,
}) => {
  const buttonStyles = mkIconButtonStyles({ variant, outlined });
  return (
    <button type="button" className={buttonStyles.root} onClick={onClick}>
      <Icon src={src} className={buttonStyles.icon} />
    </button>
  );
};

export { IconButton };
