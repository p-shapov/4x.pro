"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";
import { create } from "zustand";

import { Dialog } from "@4x.pro/ui-kit/dialog";
import { MessageDialog } from "@4x.pro/ui-kit/message-dialog";

import { mkWalletsDialogStyles } from "./styles";
import { WalletButton } from "./wallet-button";

type Store = {
  isOpen: boolean;
};

type Actions = {
  open: () => void;
  close: () => void;
};

const useWalletsDialog = create<Store & Actions>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

const WalletsDialog: FC = () => {
  const walletsDialogStyles = mkWalletsDialogStyles();
  const { isOpen, close } = useWalletsDialog();
  const { wallets, connected } = useWallet();

  const getContent = () => {
    if (connected) return null;
    return (
      <ul className={walletsDialogStyles.root}>
        {wallets.map((wallet) => (
          <li key={wallet.adapter.name} className={walletsDialogStyles.item}>
            <WalletButton wallet={wallet} />
          </li>
        ))}
      </ul>
    );
  };
  return (
    <>
      <MessageDialog
        type="success"
        title="Wallet connected"
        open={isOpen && connected}
        okText="Start trading"
        onClose={close}
        onOk={close}
      />
      <Dialog title="Select wallet" open={isOpen && !connected} onClose={close}>
        {getContent()}
      </Dialog>
    </>
  );
};

export { WalletsDialog, useWalletsDialog };
