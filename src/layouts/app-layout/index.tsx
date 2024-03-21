import Image from "next/image";
import type { FC, PropsWithChildren } from "react";

import { AccountButton } from "@4x.pro/components/connection";
import { IconButton } from "@4x.pro/ui-kit/icon-button";
import { Link } from "@4x.pro/ui-kit/link";

import { mkAppLayoutStyles } from "./styles";

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const appLayoutStyles = mkAppLayoutStyles();
  return (
    <div className={appLayoutStyles.root}>
      <header className={appLayoutStyles.header}>
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
          className={appLayoutStyles.logo}
          alt="4X logo"
          width={242}
          height={20}
        />
        <div className={appLayoutStyles.controls}>
          <IconButton src="/icons/more.svg" variant="accent" outlined />
          <AccountButton variant="accent" />
        </div>
      </header>
      <main className={appLayoutStyles.main}>{children}</main>
    </div>
  );
};

export { AppLayout };
