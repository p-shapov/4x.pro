import cn from "classnames";
import type { FC } from "react";

import { Icon } from "./icon";

const PageLoader: FC = () => {
  return (
    <div
      className={cn(
        "size-full",
        "grid",
        "items-center",
        "justify-center",
        "justify-items-center",
        "content-center",
        "gap-[10px]",
      )}
    >
      <Icon
        src="/icons/spinner.svg"
        className={cn("text-accent", "size-[30px]", "animate-spin")}
      />
      <span className={cn("text-h3", "text-content-1", "uppercase")}>
        Loading...
      </span>
    </div>
  );
};

export { PageLoader };
