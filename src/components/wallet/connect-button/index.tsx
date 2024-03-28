"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import type { ComponentProps, FC } from "react";

import { trim } from "@4x.pro/shared/utils/string";
import { Button } from "@4x.pro/ui-kit/button";

import { useWalletsDialog } from "../wallets-dialog";

type Props = Omit<
  ComponentProps<typeof Button>,
  "children" | "onClick" | "type"
>;

const ConnectButton: FC<Props> = (props) => {
  const { connected, publicKey } = useWallet();
  const open = useWalletsDialog((state) => state.open);
  const handleOpen = () => {
    open();
  };
  const children = () => {
    if (connected && publicKey) {
      return trim(publicKey.toString(), 4, 4);
    }
    return "Connect wallet";
  };
  return (
    <Button {...props} onClick={handleOpen}>
      {children()}
    </Button>
  );
};

export { ConnectButton };
