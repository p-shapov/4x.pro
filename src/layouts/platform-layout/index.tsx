import cn from "classnames";
import Image from "next/image";
import type { FC, PropsWithChildren } from "react";

import { AccountButton } from "@4x.pro/components/connection";
import type { PropsWithClassName } from "@4x.pro/shared/types";
import { IconButton } from "@4x.pro/ui-kit/icon-button";
import { Link } from "@4x.pro/ui-kit/link";

import { mkPlatformLayoutStyles } from "./styles";

const PlatformLayout: FC<PropsWithClassName<PropsWithChildren>> = ({
  className,
  children,
}) => {
  const platformLayoutStyles = mkPlatformLayoutStyles();
  return (
    <div className={cn(platformLayoutStyles.overlay, className)}>
      <div className={platformLayoutStyles.root}>
        <header className={platformLayoutStyles.header}>
          <nav>
            <ul>
              <li>
                <Link
                  href="/trade"
                  size="lg"
                  text="Trade"
                  iconSrc="/icons/status-up.svg"
                />
              </li>
            </ul>
          </nav>
          <Image
            src="/images/logo.svg"
            className={platformLayoutStyles.logo}
            alt="4X logo"
            width={242}
            height={20}
          />
          <div className={platformLayoutStyles.controls}>
            <IconButton src="/icons/more.svg" variant="accent" outlined />
            <AccountButton variant="accent" />
          </div>
        </header>
        <main className={platformLayoutStyles.main}>{children}</main>
      </div>
    </div>
  );
};

export { PlatformLayout };
