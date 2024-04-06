import { BN } from "@project-serum/anchor";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection, TransactionInstruction } from "@solana/web3.js";

import { manualSendTransaction } from "@4x.pro/services/transaction-flow/handlers";
import {
  createAtaIfNeeded,
  unwrapSolIfNeeded,
} from "@4x.pro/services/transaction-flow/utils";

import type { CustodyAccount } from "../lib/custody-account";
import type { PoolAccount } from "../lib/pool-account";
import type { PositionAccount } from "../lib/position-account";
import {
  getPerpetualProgramAndProvider,
  PERPETUALS_ADDRESS,
  TRANSFER_AUTHORITY,
} from "../utils/constants";

export async function closePosition(
  rpcEndpoint: string,
  walletContextState: WalletContextState,
  connection: Connection,
  pool: PoolAccount,
  position: PositionAccount,
  custody: CustodyAccount,
  price: BN,
) {
  const { perpetual_program } = await getPerpetualProgramAndProvider(
    rpcEndpoint,
    walletContextState,
  );
  const publicKey = walletContextState.publicKey!;

  // TODO: need to take slippage as param , this is now for testing
  const adjustedPrice =
    position.side.toString() == "Long"
      ? price.mul(new BN(50)).div(new BN(100))
      : price.mul(new BN(150)).div(new BN(100));
  const userCustodyTokenAccount = await getAssociatedTokenAddress(
    custody.mint,
    publicKey,
  );
  const preInstructions: TransactionInstruction[] = [];
  const ataIx = await createAtaIfNeeded(
    publicKey,
    publicKey,
    custody.mint,
    connection,
  );
  if (ataIx) preInstructions.push(ataIx);
  const postInstructions: TransactionInstruction[] = [];
  const unwrapTx = await unwrapSolIfNeeded(publicKey);
  if (unwrapTx) postInstructions.push(...unwrapTx);
  let methodBuilder = await perpetual_program.methods
    .closePosition({
      price: adjustedPrice,
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
    })
    .preInstructions(preInstructions);

  if (position.token == "SOL")
    methodBuilder = methodBuilder.postInstructions(postInstructions);
  try {
    const tx = await methodBuilder.transaction();
    await manualSendTransaction(
      tx,
      publicKey,
      connection,
      walletContextState.signTransaction,
      "Close position",
    );
  } catch (err) {
    throw err;
  }
}
