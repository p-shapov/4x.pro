import type { Wallet } from "@project-serum/anchor";
import { AnchorProvider } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";

const getProvider = (rpcEndpoint: string, wallet: Wallet) => {
  const connection = new Connection(rpcEndpoint, {
    commitment: "processed",
  });
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "processed",
    skipPreflight: true,
  });
  return provider;
};

export { getProvider };
