"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import type { ComponentProps, FC } from "react";

import { trim } from "@4x.pro/shared/utils/string";
import { Button } from "@4x.pro/ui-kit/button";

import { useWalletsDialog } from "./wallets-dialog";

type Props = Omit<
  ComponentProps<typeof Button>,
  "children" | "onClick" | "type"
>;

const AccountButton: FC<Props> = (props) => {
  const { wallet, connected } = useWallet();
  const open = useWalletsDialog((state) => state.open);
  const children = () => {
    if (connected && wallet && wallet.adapter.publicKey) {
      return trim(wallet.adapter.publicKey.toString(), 4, 4);
    }
    return "Get started";
  };
  return (
    <Button {...props} onClick={open}>
      {children()}
    </Button>
  );
};

export { AccountButton };
