import { BN } from "@project-serum/anchor";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection, TransactionInstruction } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { manualSendTransaction } from "@4x.pro/services/transaction-flow/handlers";
import {
  createAtaIfNeeded,
  unwrapSolIfNeeded,
  wrapSolIfNeeded,
} from "@4x.pro/services/transaction-flow/utils";

import type { CustodyAccount } from "../lib/custody-account";
import type { PoolAccount } from "../lib/pool-account";
import { Tab } from "../lib/types";
import {
  getPerpetualProgramAndProvider,
  PERPETUALS_ADDRESS,
  TRANSFER_AUTHORITY,
} from "../utils/constants";

const changeLiquidity = async (
  rpcEndpoint: string,
  walletContextState: WalletContextState,
  connection: Connection,
  pool: PoolAccount,
  custody: CustodyAccount,
  tokenAmount: number,
  liquidityAmount: number,
  tab: Tab,
) => {
  const { perpetual_program } = await getPerpetualProgramAndProvider(
    rpcEndpoint,
    walletContextState,
  );
  const publicKey = walletContextState.publicKey!;
  const lpTokenAccount = await getAssociatedTokenAddress(
    pool.getLpTokenMint(),
    publicKey,
  );
  const userCustodyTokenAccount = await getAssociatedTokenAddress(
    custody.mint,
    publicKey,
  );
  const preInstructions: TransactionInstruction[] = [];
  const ataIx = await createAtaIfNeeded(
    publicKey,
    publicKey,
    pool.getLpTokenMint(),
    connection,
  );
  if (ataIx) preInstructions.push(ataIx);
  if (custody.getToken() == "SOL") {
    const ataIx = await createAtaIfNeeded(
      publicKey,
      publicKey,
      custody.mint,
      connection,
    );
    if (ataIx) preInstructions.push(ataIx);
    const wrapInstructions = await wrapSolIfNeeded(
      publicKey,
      connection,
      tokenAmount,
    );
    if (wrapInstructions) {
      preInstructions.push(...wrapInstructions);
    }
  }
  const postInstructions: TransactionInstruction[] = [];
  const unwrapTx = await unwrapSolIfNeeded(publicKey);
  if (unwrapTx) postInstructions.push(...unwrapTx);
  let methodBuilder;
  if (tab == Tab.Add) {
    let amountIn;
    const minLpAmountOut = new BN(
      liquidityAmount * 10 ** pool.lpData.decimals * 0.8,
    );
    if (custody.getToken() === "SOL") {
      amountIn = new BN(tokenAmount * LAMPORTS_PER_SOL);
    } else {
      amountIn = new BN(tokenAmount * 10 ** custody.decimals);
    }
    methodBuilder = await perpetual_program.methods
      .addLiquidity({ amountIn, minLpAmountOut })
      .accounts({
        owner: publicKey,
        fundingAccount: userCustodyTokenAccount, // user token account for custody token account
        lpTokenAccount,
        transferAuthority: TRANSFER_AUTHORITY,
        perpetuals: PERPETUALS_ADDRESS,
        pool: pool.address,
        custody: custody.address,
        custodyOracleAccount: custody.oracle.oracleAccount,
        custodyTokenAccount: custody.tokenAccount,
        lpTokenMint: pool.getLpTokenMint(),
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .remainingAccounts(pool.getCustodyMetas());
  } else if (tab == Tab.Remove) {
    const lpAmountIn = new BN(liquidityAmount * 10 ** pool.lpData.decimals);
    let minAmountOut;
    if (custody.getToken() === "SOL") {
      minAmountOut = new BN(tokenAmount * LAMPORTS_PER_SOL * 0.9);
    } else {
      minAmountOut = new BN(tokenAmount * 10 ** custody.decimals * 0.9);
    }
    methodBuilder = await perpetual_program.methods
      .removeLiquidity({ lpAmountIn, minAmountOut })
      .accounts({
        owner: publicKey,
        receivingAccount: userCustodyTokenAccount, // user token account for custody token account
        lpTokenAccount,
        transferAuthority: TRANSFER_AUTHORITY,
        perpetuals: PERPETUALS_ADDRESS,
        pool: pool.address,
        custody: custody.address,
        custodyOracleAccount: custody.oracle.oracleAccount,
        custodyTokenAccount: custody.tokenAccount,
        lpTokenMint: pool.getLpTokenMint(),
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .remainingAccounts(pool.getCustodyMetas());
  }
  if (preInstructions)
    methodBuilder = methodBuilder?.preInstructions(preInstructions);
  if (custody.getToken() == "SOL") {
    methodBuilder = methodBuilder?.postInstructions(postInstructions);
  }
  try {
    const tx = await methodBuilder?.transaction();
    if (!tx) {
      throw new Error("Failed to build transaction");
    }
    await manualSendTransaction(
      tx,
      publicKey,
      connection,
      walletContextState.signTransaction,
      "Change liquidity",
    );
  } catch (err) {
    throw err;
  }
};

export { changeLiquidity };
