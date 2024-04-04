/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Wallet } from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import type NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Transaction } from "@solana/web3.js";
import { Keypair, PublicKey } from "@solana/web3.js";

import PerpetualsJson from "@target/idl/perpetuals.json";
import { IDL as PERPETUALS_IDL } from "@target/types/perpetuals";

import { getProvider } from "@4x.pro/shared/utils/provider";

const PERPETUALS_PROGRAM_ID = new PublicKey(
  PerpetualsJson["metadata"]["address"],
);

class DefaultWallet implements Wallet {
  constructor(readonly payer: Keypair) {}

  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }

  static local(): NodeWallet | never {
    throw new Error("Local wallet not supported");
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
    return tx;
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    return txs;
  }
}

const getPerpetualProgramAndProvider = (
  rpcEndpoint: string,
  walletContextState?: WalletContextState,
) => {
  let provider;

  if (
    walletContextState &&
    walletContextState.signTransaction &&
    walletContextState.signAllTransactions &&
    walletContextState.publicKey
  ) {
    // @ts-ignore
    const wallet: Wallet = {
      signTransaction: walletContextState.signTransaction,
      signAllTransactions: walletContextState.signAllTransactions,
      publicKey: walletContextState.publicKey,
    };

    provider = getProvider(rpcEndpoint, wallet);
  } else {
    provider = getProvider(rpcEndpoint, new DefaultWallet(DEFAULT_PERPS_USER));
  }

  const perpetual_program = new Program(
    PERPETUALS_IDL,
    PERPETUALS_PROGRAM_ID,
    provider,
  );

  return { perpetual_program, provider };
};

const TRANSFER_AUTHORITY = findProgramAddressSync(
  [Buffer.from("transfer_authority")],
  PERPETUALS_PROGRAM_ID,
)[0];

const PERPETUALS_ADDRESS = findProgramAddressSync(
  [Buffer.from("perpetuals")],
  PERPETUALS_PROGRAM_ID,
)[0];

const DEFAULT_PERPS_USER = Keypair.fromSecretKey(
  Uint8Array.from([
    130, 82, 70, 109, 220, 141, 128, 34, 238, 5, 80, 156, 116, 150, 24, 45, 33,
    132, 119, 244, 40, 40, 201, 182, 195, 179, 90, 172, 51, 27, 110, 208, 61,
    23, 43, 217, 131, 209, 127, 113, 93, 139, 35, 156, 34, 16, 94, 236, 175,
    232, 174, 79, 209, 223, 86, 131, 148, 188, 126, 217, 19, 248, 236, 107,
  ]),
);

export {
  getPerpetualProgramAndProvider,
  PERPETUALS_ADDRESS,
  TRANSFER_AUTHORITY,
  PERPETUALS_PROGRAM_ID,
  DEFAULT_PERPS_USER,
};
