/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BN } from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection, TransactionInstruction } from "@solana/web3.js";
import { SystemProgram } from "@solana/web3.js";

import type { Token } from "@4x.pro/app-config";
import { manualSendTransaction } from "@4x.pro/services/transaction-flow/handlers";
import {
  createAtaIfNeeded,
  unwrapSolIfNeeded,
  wrapSolIfNeeded,
} from "@4x.pro/services/transaction-flow/utils";
import {
  formatCurrency,
  formatCurrency_USD,
} from "@4x.pro/shared/utils/number";

import { swapTransactionBuilder } from "./swap";
import type { CustodyAccount } from "../lib/custody-account";
import type { PoolAccount } from "../lib/pool-account";
import type { PositionSide } from "../lib/types";
import { TradeSide } from "../lib/types";
import {
  PERPETUALS_ADDRESS,
  TRANSFER_AUTHORITY,
  getPerpetualProgramAndProvider,
} from "../utils/constants";
import { ViewHelper } from "../utils/view-helpers";

const openPositionBuilder = async (
  rpcEndpoint: string,
  connection: Connection,
  walletContextState: WalletContextState,
  pool: PoolAccount,
  payCustody: CustodyAccount,
  positionCustody: CustodyAccount,
  payAmount: number,
  positionAmount: number,
  price: number,
  side: PositionSide,
  leverage: number,
  slippage: number,
  stopLoss: number | null,
  takeProfit: number | null,
) => {
  const { perpetual_program, provider } = await getPerpetualProgramAndProvider(
    rpcEndpoint,
    walletContextState,
  );
  const publicKey = walletContextState.publicKey!;
  const newPrice =
    side === "long"
      ? new BN(price * 10 ** 6 * (1 + slippage))
      : new BN(price * 10 ** 6 * (1 - slippage));
  const userCustodyTokenAccount = await getAssociatedTokenAddress(
    positionCustody.mint,
    publicKey,
  );
  const positionAccount = findProgramAddressSync(
    [
      Buffer.from("position"),
      publicKey.toBuffer(),
      pool.address.toBuffer(),
      positionCustody.address.toBuffer(),
      // @ts-ignore
      side === "long" ? [1] : [2],
    ],
    perpetual_program.programId,
  )[0];
  const preInstructions: TransactionInstruction[] = [];
  const finalPayAmount = positionAmount / leverage;
  if (payCustody.getToken() != positionCustody.getToken()) {
    const View = new ViewHelper(connection, provider);
    const swapInfo = await View.getSwapAmountAndFees(
      payAmount,
      pool!,
      payCustody,
      positionCustody,
    );
    const swapAmountOut =
      Number(swapInfo.amountOut) / 10 ** positionCustody.decimals;
    const swapFee = Number(swapInfo.feeOut) / 10 ** positionCustody.decimals;
    const recAmt = swapAmountOut - swapFee;
    const getEntryPrice = await View.getEntryPriceAndFee(
      recAmt,
      positionAmount,
      side,
      pool!,
      positionCustody!,
    );
    const entryFee = Number(getEntryPrice.fee) / 10 ** positionCustody.decimals;
    const swapInfo2 = await View.getSwapAmountAndFees(
      payAmount + entryFee + swapFee,
      pool!,
      payCustody,
      positionCustody,
    );
    const swapAmountOut2 =
      Number(swapInfo2.amountOut) / 10 ** positionCustody.decimals -
      Number(swapInfo2.feeOut) / 10 ** positionCustody.decimals -
      entryFee;
    let extraSwap = 0;
    if (swapAmountOut2 < finalPayAmount) {
      const difference = (finalPayAmount - swapAmountOut2) / swapAmountOut2;
      extraSwap = difference * (payAmount + entryFee + swapFee);
    }
    const { methodBuilder: swapBuilder, preInstructions: swapPreInstructions } =
      await swapTransactionBuilder(
        rpcEndpoint,
        walletContextState,
        connection,
        pool,
        payCustody.getToken(),
        positionCustody.getToken(),
        payAmount + entryFee + swapFee + extraSwap,
        recAmt,
      );
    const ix = await swapBuilder.instruction();
    preInstructions.push(...swapPreInstructions, ix);
  }
  if (preInstructions.length == 0 && positionCustody.getToken() == "SOL") {
    const ataIx = await createAtaIfNeeded(
      publicKey,
      publicKey,
      positionCustody.mint,
      connection,
    );
    if (ataIx) preInstructions.push(ataIx);
    const wrapInstructions = await wrapSolIfNeeded(
      publicKey,
      connection,
      payAmount,
    );
    if (wrapInstructions) {
      preInstructions.push(...wrapInstructions);
    }
  }
  const postInstructions: TransactionInstruction[] = [];
  const unwrapTx = await unwrapSolIfNeeded(publicKey);
  if (unwrapTx) postInstructions.push(...unwrapTx);
  const params = {
    price: newPrice,
    collateral: new BN(finalPayAmount * 10 ** positionCustody.decimals),
    size: new BN(positionAmount * 10 ** positionCustody.decimals),
    side: side == "long" ? TradeSide.Long : TradeSide.Short,
    stopLoss: stopLoss ? new BN(stopLoss * 10 ** 6) : null,
    takeProfit: takeProfit ? new BN(takeProfit * 10 ** 6) : null,
  };
  let methodBuilder = perpetual_program.methods.openPosition(params).accounts({
    owner: publicKey,
    fundingAccount: userCustodyTokenAccount,
    transferAuthority: TRANSFER_AUTHORITY,
    perpetuals: PERPETUALS_ADDRESS,
    pool: pool.address,
    position: positionAccount,
    custody: positionCustody.address,
    custodyOracleAccount: positionCustody.oracle.oracleAccount,
    custodyTokenAccount: positionCustody.tokenAccount,
    systemProgram: SystemProgram.programId,
    tokenProgram: TOKEN_PROGRAM_ID,
  });
  if (preInstructions) {
    methodBuilder = methodBuilder.preInstructions(preInstructions);
  }
  if (payCustody.getToken() == "SOL" || positionCustody.getToken() == "SOL") {
    methodBuilder = methodBuilder.postInstructions(postInstructions);
  }
  const tx = await methodBuilder.transaction();
  return await manualSendTransaction(
    tx,
    publicKey,
    connection,
    walletContextState.signTransaction,
    "Open position",
    {
      Price: formatCurrency_USD(price),
      Size: formatCurrency(positionCustody.getToken())(positionAmount, 4),
    },
  );
};

const openPosition = async (
  rpcEndpoint: string,
  connection: Connection,
  walletContextState: WalletContextState,
  pool: PoolAccount,
  payToken: Token,
  positionToken: Token,
  payAmount: number,
  positionAmount: number,
  price: number,
  side: PositionSide,
  leverage: number,
  slippage: number,
  stopLoss: number | null,
  takeProfit: number | null,
) => {
  const payCustody = pool.getCustodyAccount(payToken)!;
  const positionCustody = pool.getCustodyAccount(positionToken)!;
  return await openPositionBuilder(
    rpcEndpoint,
    connection,
    walletContextState,
    pool,
    payCustody,
    positionCustody,
    payAmount,
    positionAmount,
    price,
    side,
    leverage,
    slippage,
    stopLoss,
    takeProfit,
  );
};

export { openPositionBuilder, openPosition };
