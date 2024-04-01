"use client";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import type { Adapter } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  SolflareWalletAdapter,
  WalletConnectWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import type { FC, PropsWithChildren } from "react";

import { useDexPlatformConfig } from "./store";

const network =
  process.env.NEXT_PUBLIC_IS_DEVNET === "true"
    ? WalletAdapterNetwork.Devnet
    : WalletAdapterNetwork.Mainnet;

const wallets: Adapter[] = [
  new SolflareWalletAdapter({ network }),
  new WalletConnectWalletAdapter({
    network,
    options: {
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
      metadata: {
        name: "4x Protocol",
        description: "DEX Platform",
      },
    },
  }),
];

const dexPlatformQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 0,
      gcTime: 1000 * 60 * 60,
    },
  },
});

const DexPlatformProvider: FC<PropsWithChildren> = ({ children }) => {
  const { rpcEndpoint, pythConnection } = useDexPlatformConfig((state) => ({
    pythConnection: state.pythConnection,
    rpcEndpoint: state.rpcEndpoint,
  }));
  useEffect(() => {
    pythConnection?.start();
    return () => {
      pythConnection?.stop();
    };
  }, [pythConnection]);
  return (
    <QueryClientProvider client={dexPlatformQueryClient}>
      <ConnectionProvider endpoint={rpcEndpoint}>
        <WalletProvider wallets={wallets}>{children}</WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};

export { dexPlatformQueryClient, DexPlatformProvider };
