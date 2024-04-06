import {
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
  createSyncNativeInstruction,
  getAssociatedTokenAddress,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import type {
  Connection,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";

import { checkIfAccountExists } from "@4x.pro/shared/utils/retrieve-data";

const TRX_URL = (txid: string) =>
  `https://explorer.solana.com/tx/${txid}?cluster=devnet`;

const ACCOUNT_URL = (address: string) =>
  `https://explorer.solana.com/address/${address}?cluster=devnet`;

const createAtaIfNeeded = async (
  publicKey: PublicKey,
  payer: PublicKey,
  mint: PublicKey,
  connection: Connection,
) => {
  const associatedTokenAccount = await getAssociatedTokenAddress(
    mint,
    publicKey,
  );
  if (!(await checkIfAccountExists(associatedTokenAccount, connection))) {
    return createAssociatedTokenAccountInstruction(
      payer,
      associatedTokenAccount,
      publicKey,
      mint,
    );
  }
  return null;
};

const wrapSolIfNeeded = async (
  publicKey: PublicKey,
  connection: Connection,
  payAmount: number,
) => {
  const preInstructions: TransactionInstruction[] = [];
  const associatedTokenAccount = await getAssociatedTokenAddress(
    NATIVE_MINT,
    publicKey,
  );
  const balance =
    (await connection.getBalance(associatedTokenAccount)) / LAMPORTS_PER_SOL;
  if (balance < payAmount) {
    preInstructions.push(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: associatedTokenAccount,
        lamports: Math.floor((payAmount - balance) * LAMPORTS_PER_SOL * 3),
      }),
    );
    preInstructions.push(
      createSyncNativeInstruction(associatedTokenAccount, TOKEN_PROGRAM_ID),
    );
  }
  return preInstructions.length > 0 ? preInstructions : null;
};

const unwrapSolIfNeeded = async (publicKey: PublicKey) => {
  const preInstructions: TransactionInstruction[] = [];
  const associatedTokenAccount = await getAssociatedTokenAddress(
    NATIVE_MINT,
    publicKey,
  );
  const balance = 1;
  if (balance > 0) {
    preInstructions.push(
      createCloseAccountInstruction(
        associatedTokenAccount,
        publicKey,
        publicKey,
      ),
    );
  }
  return preInstructions.length > 0 ? preInstructions : null;
};

export {
  createAtaIfNeeded,
  wrapSolIfNeeded,
  unwrapSolIfNeeded,
  TRX_URL,
  ACCOUNT_URL,
};
