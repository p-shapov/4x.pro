import { BN } from "@project-serum/anchor";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection, TransactionInstruction } from "@solana/web3.js";

import type { Token } from "@4x.pro/app-config";
import { manualSendTransaction } from "@4x.pro/services/transaction-flow/handlers";
import {
  createAtaIfNeeded,
  unwrapSolIfNeeded,
  wrapSolIfNeeded,
} from "@4x.pro/services/transaction-flow/utils";

import type { PoolAccount } from "../lib/pool-account";
import {
  getPerpetualProgramAndProvider,
  PERPETUALS_ADDRESS,
  TRANSFER_AUTHORITY,
} from "../utils/constants";

const swapTransactionBuilder = async (
  rpcEndpoint: string,
  walletContextState: WalletContextState,
  connection: Connection,
  pool: PoolAccount,
  topToken: Token,
  bottomToken: Token,
  amtInNumber: number,
  minAmtOutNumber?: number,
) => {
  const { perpetual_program } = await getPerpetualProgramAndProvider(
    rpcEndpoint,
    walletContextState,
  );
  const publicKey = walletContextState.publicKey!;
  const receivingCustody = pool.getCustodyAccount(topToken)!;
  const fundingAccount = await getAssociatedTokenAddress(
    receivingCustody.mint,
    publicKey,
  );
  const dispensingCustody = pool.getCustodyAccount(bottomToken)!;
  const receivingAccount = await getAssociatedTokenAddress(
    dispensingCustody.mint,
    publicKey,
  );
  const preInstructions: TransactionInstruction[] = [];
  if (receivingCustody.getToken() == "SOL") {
    const ataIx = await createAtaIfNeeded(
      publicKey,
      publicKey,
      receivingCustody.mint,
      connection,
    );
    if (ataIx) preInstructions.push(ataIx);
    const wrapInstructions = await wrapSolIfNeeded(
      publicKey,
      connection,
      amtInNumber,
    );
    if (wrapInstructions) {
      preInstructions.push(...wrapInstructions);
    }
  }
  const ataIx = await createAtaIfNeeded(
    publicKey,
    publicKey,
    dispensingCustody.mint,
    connection,
  );
  if (ataIx) preInstructions.push(ataIx);
  let minAmountOut;
  // TODO explain why there is an if statement here
  if (minAmtOutNumber) {
    minAmountOut = new BN(minAmtOutNumber * 10 ** dispensingCustody.decimals)
      .mul(new BN(90))
      .div(new BN(100));
  } else {
    minAmountOut = new BN(amtInNumber * 10 ** dispensingCustody.decimals)
      .mul(new BN(90))
      .div(new BN(100));
  }
  const amountIn = new BN(amtInNumber * 10 ** receivingCustody.decimals);
  const postInstructions: TransactionInstruction[] = [];
  const unwrapTx = await unwrapSolIfNeeded(publicKey);
  if (unwrapTx) postInstructions.push(...unwrapTx);
  const params = {
    amountIn,
    minAmountOut,
  };
  let methodBuilder = perpetual_program.methods.swap(params).accounts({
    owner: publicKey,
    fundingAccount: fundingAccount,
    receivingAccount: receivingAccount,
    transferAuthority: TRANSFER_AUTHORITY,
    perpetuals: PERPETUALS_ADDRESS,
    pool: pool.address,

    receivingCustody: receivingCustody.address,
    receivingCustodyOracleAccount: receivingCustody.oracle.oracleAccount,
    receivingCustodyTokenAccount: receivingCustody.tokenAccount,

    dispensingCustody: dispensingCustody.address,
    dispensingCustodyOracleAccount: dispensingCustody.oracle.oracleAccount,
    dispensingCustodyTokenAccount: dispensingCustody.tokenAccount,

    tokenProgram: TOKEN_PROGRAM_ID,
  });
  if (preInstructions) {
    methodBuilder = methodBuilder.preInstructions(preInstructions);
  }
  if (
    dispensingCustody.getToken() == "SOL" ||
    receivingCustody.getToken() == "SOL"
  ) {
    methodBuilder = methodBuilder.postInstructions(postInstructions);
  }
  return { methodBuilder, preInstructions, postInstructions };
};

const swap = async (
  rpcEndpoint: string,
  walletContextState: WalletContextState,
  connection: Connection,
  pool: PoolAccount,
  topToken: Token,
  bottomToken: Token,
  amtInNumber: number,
  minAmtOutNumber?: number,
) => {
  const { methodBuilder } = await swapTransactionBuilder(
    rpcEndpoint,
    walletContextState,
    connection,
    pool,
    topToken,
    bottomToken,
    amtInNumber,
    minAmtOutNumber,
  );
  const publicKey = walletContextState.publicKey!;
  const tx = await methodBuilder.transaction();
  return await manualSendTransaction(
    tx,
    publicKey,
    connection,
    walletContextState.signTransaction,
    "Swap",
  );
};

export { swap, swapTransactionBuilder };
