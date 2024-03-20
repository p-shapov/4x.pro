import type { Adapter } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import type { FC, PropsWithChildren } from "react";

import { networkConfig } from "./network-config";

const wallets: Adapter[] = [new SolflareWalletAdapter()];

const WalletAdapterProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={networkConfig.NetworkRPCURLs.solana}>
      <WalletProvider wallets={wallets}>{children}</WalletProvider>
    </ConnectionProvider>
  );
};

export { WalletAdapterProvider };
