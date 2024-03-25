"use client";
import type { Wallet } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";

import { Icon } from "@4x.pro/ui-kit/icon";

import { mkWalletButtonStyles } from "./styles";

type Props = {
  wallet: Wallet;
};

const WalletButton: FC<Props> = ({ wallet }) => {
  const walletButtonStyles = mkWalletButtonStyles();
  const { select } = useWallet();
  const handleConnectWallet = async () => {
    select(wallet.adapter.name);
    try {
      await wallet.adapter.connect();
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={handleConnectWallet}
      className={walletButtonStyles.root}
    >
      <img
        src={wallet.adapter.icon}
        alt={wallet.adapter.name}
        className={walletButtonStyles.walletIcon}
      />
      <span className={walletButtonStyles.label}>
        <span className={walletButtonStyles.text}> {wallet.adapter.name}</span>
        <Icon
          src="/icons/arrow-right-1.svg"
          className={walletButtonStyles.arrowIcon}
        />
      </span>
    </button>
  );
};

export { WalletButton };
