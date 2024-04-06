import { BN } from "@project-serum/anchor";
import {
  getAssociatedTokenAddress,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection, TransactionInstruction } from "@solana/web3.js";

import { manualSendTransaction } from "@4x.pro/services/transaction-flow/handlers";
import {
  createAtaIfNeeded,
  unwrapSolIfNeeded,
  wrapSolIfNeeded,
} from "@4x.pro/services/transaction-flow/utils";

import type { PoolAccount } from "../lib/pool-account";
import type { PositionAccount } from "../lib/position-account";
import { Tab } from "../lib/types";
import {
  getPerpetualProgramAndProvider,
  PERPETUALS_ADDRESS,
  TRANSFER_AUTHORITY,
} from "../utils/constants";

const changeCollateral = async (
  rpcEndpoint: string,
  connection: Connection,
  walletContextState: WalletContextState,
  pool: PoolAccount,
  position: PositionAccount,
  collatNum: number,
  tab: Tab,
) => {
  const { perpetual_program } = await getPerpetualProgramAndProvider(
    rpcEndpoint,
    walletContextState,
  );
  const publicKey = walletContextState.publicKey!;
  const custody = pool.getCustodyAccount(position.token)!;
  const userCustodyTokenAccount = await getAssociatedTokenAddress(
    custody.mint,
    publicKey,
  );
  const preInstructions: TransactionInstruction[] = [];
  let methodBuilder;
  const postInstructions: TransactionInstruction[] = [];
  const unwrapTx = await unwrapSolIfNeeded(publicKey);
  if (unwrapTx) postInstructions.push(...unwrapTx);
  if (tab == Tab.Add) {
    if (position.token == "SOL") {
      const ataIx = await createAtaIfNeeded(
        publicKey,
        publicKey,
        NATIVE_MINT,
        connection,
      );
      if (ataIx) preInstructions.push(ataIx);
      const wrapInstructions = await wrapSolIfNeeded(
        publicKey,
        connection,
        collatNum,
      );
      if (wrapInstructions) {
        preInstructions.push(...wrapInstructions);
      }
    }
    const collateral = new BN(collatNum * 10 ** custody.decimals);
    methodBuilder = perpetual_program.methods
      .addCollateral({
        collateral,
      })
      .accounts({
        owner: publicKey,
        fundingAccount: userCustodyTokenAccount, // user token account for custody token account
        transferAuthority: TRANSFER_AUTHORITY,
        perpetuals: PERPETUALS_ADDRESS,
        pool: pool.address,
        position: position.address,
        custody: custody.address,
        custodyOracleAccount: custody.oracle.oracleAccount,
        custodyTokenAccount: custody.tokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      });
  } else {
    if (position.token == "SOL") {
      const ataIx = await createAtaIfNeeded(
        publicKey,
        publicKey,
        NATIVE_MINT,
        connection,
      );
      if (ataIx) preInstructions.push(ataIx);
    }
    const collateralUsd = new BN(collatNum * 10 ** 6);
    methodBuilder = perpetual_program.methods
      .removeCollateral({
        collateralUsd,
      })
      .accounts({
        owner: publicKey,
        receivingAccount: userCustodyTokenAccount,
        transferAuthority: TRANSFER_AUTHORITY,
        perpetuals: PERPETUALS_ADDRESS,
        pool: pool.address,
        position: position.address,
        custody: custody.address,
        custodyOracleAccount: custody.oracle.oracleAccount,
        custodyTokenAccount: custody.tokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      });
  }
  if (preInstructions)
    methodBuilder = methodBuilder.preInstructions(preInstructions);
  if (position.token == "SOL")
    methodBuilder = methodBuilder.postInstructions(postInstructions);
  const tx = await methodBuilder.transaction();
  return await manualSendTransaction(
    tx,
    publicKey,
    connection,
    walletContextState.signTransaction,
    "Change collateral",
  );
};

export { changeCollateral };
