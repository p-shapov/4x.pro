"use client";
import type { Wallet } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";
import { create } from "zustand";

import { Button } from "@4x.pro/ui-kit/button";
import { Dialog } from "@4x.pro/ui-kit/dialog";

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
  const { isOpen, close } = useWalletsDialog();
  const { wallets, select } = useWallet();
  const mkHandleConnect = (wallet: Wallet) => async () => {
    select(wallet.adapter.name);
    try {
      await wallet.adapter.connect();
      close();
    } catch {}
  };
  return (
    <Dialog title="Select wallet" open={isOpen} onClose={close}>
      <div className="grid gap-[10px]">
        {wallets.map((wallet) => (
          <Button
            key={wallet.adapter.name}
            onClick={mkHandleConnect(wallet)}
            variant="accent"
          >
            {wallet.adapter.name}
          </Button>
        ))}
      </div>
    </Dialog>
  );
};

export { WalletsDialog, useWalletsDialog };
