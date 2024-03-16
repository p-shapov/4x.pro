import type { Adapter } from "@solana/wallet-adapter-base";
import { WalletAdapterNetwork as WalletAdapterNetworks } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import type { FC, PropsWithChildren } from "react";

const WalletAdapterNetwork =
  process.env.NEXT_PUBLIC_IS_DEVNET === "true"
    ? WalletAdapterNetworks.Devnet
    : WalletAdapterNetworks.Mainnet;
const endpoint = clusterApiUrl(WalletAdapterNetwork);
const wallets: Adapter[] = [new SolflareWalletAdapter()];

const WalletAdapterProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>{children}</WalletProvider>
    </ConnectionProvider>
  );
};

export { WalletAdapterProvider, WalletAdapterNetwork };
