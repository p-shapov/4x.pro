"use client";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import type { Adapter } from "@solana/wallet-adapter-base";
import { GlowWalletAdapter } from "@solana/wallet-adapter-glow";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { FC, PropsWithChildren } from "react";

import { useDexPlatformConfig } from "./store";

const network =
  process.env.NEXT_PUBLIC_IS_DEVNET === "true"
    ? WalletAdapterNetwork.Devnet
    : WalletAdapterNetwork.Mainnet;

const wallets: Adapter[] = [
  new BackpackWalletAdapter({ network }),
  new PhantomWalletAdapter({ network }),
  new SolflareWalletAdapter({ network }),
  new GlowWalletAdapter({ network }),
];

const dexPlatformQueryClient = new QueryClient();

const DexPlatformProvider: FC<PropsWithChildren> = ({ children }) => {
  const rpcEndpoint = useDexPlatformConfig((state) => state.rpcEndpoint);
  return (
    <QueryClientProvider client={dexPlatformQueryClient}>
      <ConnectionProvider endpoint={rpcEndpoint}>
        <WalletProvider wallets={wallets}>{children}</WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};

export { dexPlatformQueryClient, DexPlatformProvider };
