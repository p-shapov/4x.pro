"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import cn from "classnames";
import Image from "next/image";
import type { FC, PropsWithChildren } from "react";

import { Wallet } from "@4x.pro/components/wallet";
import { useIsMounted } from "@4x.pro/shared/hooks/use-is-mounted";
import type { PropsWithClassName } from "@4x.pro/shared/types";
import { IconButton } from "@4x.pro/ui-kit/icon-button";
import { Link } from "@4x.pro/ui-kit/link";

import { mkPerpetualsLayoutStyles } from "./styles";

const PerpetualsLayout: FC<PropsWithClassName<PropsWithChildren>> = ({
  className,
  children,
}) => {
  const isMounted = useIsMounted();
  const perpetualsLayoutStyles = mkPerpetualsLayoutStyles();
  const { connected } = useWallet();
  if (!isMounted) return null;
  return (
    <div className={cn(perpetualsLayoutStyles.overlay, className)}>
      <Wallet.Dialog />
      <div className={perpetualsLayoutStyles.root}>
        <header className={perpetualsLayoutStyles.header}>
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
            className={perpetualsLayoutStyles.logo}
            alt="4X logo"
            width={242}
            height={20}
          />
          <div className={perpetualsLayoutStyles.controls}>
            <IconButton src="/icons/more.svg" variant="accent" outlined />
            {connected ? (
              <Wallet.Account />
            ) : (
              <Wallet.Connect variant="accent" fill={false} />
            )}
          </div>
        </header>
        <main className={perpetualsLayoutStyles.main}>{children}</main>
      </div>
    </div>
  );
};

export { PerpetualsLayout };
