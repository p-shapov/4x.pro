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
import type { FC, PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";

import { useAppConfig } from "./store";

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
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 0,
      gcTime: 1000 * 60 * 60,
    },
  },
});

const AppConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  const { rpcEndpoint } = useAppConfig((state) => ({
    rpcEndpoint: state.rpcEndpoint,
  }));
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={rpcEndpoint}>
        <WalletProvider wallets={wallets}>
          {children}
          <ToastContainer />
        </WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};

export { queryClient, AppConfigProvider };
