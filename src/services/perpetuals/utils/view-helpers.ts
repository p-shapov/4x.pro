/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AnchorProvider } from "@project-serum/anchor";
import { BN, Program } from "@project-serum/anchor";
import { decode } from "@project-serum/anchor/dist/cjs/utils/bytes/base64";
import type {
  Connection,
  RpcResponseAndContext,
  SimulatedTransactionResponse,
  Transaction,
} from "@solana/web3.js";

import type { Perpetuals } from "@target/types/perpetuals";
import { IDL as PERPETUALS_IDL } from "@target/types/perpetuals";

import {
  DEFAULT_PERPS_USER,
  PERPETUALS_ADDRESS,
  PERPETUALS_PROGRAM_ID,
} from "./constants";
import { IdlCoder } from "./idl-coder";
import type { CustodyAccount } from "../lib/custody-account";
import type { PoolAccount } from "../lib/pool-account";
import type { PositionAccount } from "../lib/position-account";
import type { Side } from "../lib/types";

class ViewHelper {
  program: Program<Perpetuals>;
  connection: Connection;
  provider: AnchorProvider;
  //   poolConfig: PoolConfig;

  constructor(connection: Connection, provider: AnchorProvider) {
    this.connection = connection;
    this.provider = provider;
    this.program = new Program(PERPETUALS_IDL, PERPETUALS_PROGRAM_ID, provider);
    // this.poolConfig = PoolConfig.fromIdsByName(DEFAULT_POOL, CLUSTER);
  }

  // may need to add blockhash and also probably use VersionedTransactions
  simulateTransaction = async (
    transaction: Transaction,
  ): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> => {
    transaction.feePayer = DEFAULT_PERPS_USER.publicKey;
    return this.connection.simulateTransaction(transaction);
  };

  decodeLogs<T>(
    data: RpcResponseAndContext<SimulatedTransactionResponse>,
    instructionNumber: number,
  ): T {
    const returnPrefix = `Program return: ${PERPETUALS_PROGRAM_ID} `;
    if (data.value.logs && data.value.err === null) {
      const returnLog = data.value.logs.find((l: any) =>
        l.startsWith(returnPrefix),
      );
      if (!returnLog) {
        throw new Error("View expected return log");
      }
      const returnData = decode(returnLog.slice(returnPrefix.length));
      // @ts-ignore
      const returnType = PERPETUALS_IDL.instructions[instructionNumber].returns;

      if (!returnType) {
        throw new Error("View expected return type");
      }
      const coder = IdlCoder.fieldLayout(
        { type: returnType },
        Array.from([
          ...(PERPETUALS_IDL.accounts ?? []),
          ...(PERPETUALS_IDL.types ?? []),
        ]),
      );
      return coder.decode(returnData);
    } else {
      throw new Error(`No Logs Found `, { cause: data });
    }
  }

  getAssetsUnderManagement = async (pool: PoolAccount) => {
    const program = new Program(
      PERPETUALS_IDL,
      PERPETUALS_PROGRAM_ID,
      this.provider,
    );

    const transaction = await program.methods
      // @ts-ignore
      .getAssetsUnderManagement({})
      .accounts({
        perpetuals: PERPETUALS_ADDRESS,
        pool: pool.address,
      })
      .remainingAccounts(pool.getCustodyMetas())
      .transaction();

    const result = await this.simulateTransaction(transaction);
    const index = PERPETUALS_IDL.instructions.findIndex(
      (f) => f.name === "getAssetsUnderManagement",
    );
    return this.decodeLogs<BN>(result, index);
  };

  getEntryPriceAndFee = async (
    payAmount: number,
    positionAmount: number,
    side: Side,
    pool: PoolAccount,
    custody: CustodyAccount,
  ) => {
    const program = new Program(
      PERPETUALS_IDL,
      PERPETUALS_PROGRAM_ID,
      this.provider,
    );
    const collateral = new BN(payAmount * 10 ** custody.decimals);
    const size = new BN(positionAmount * 10 ** custody.decimals);
    const transaction: Transaction = await program.methods
      // @ts-ignore
      .getEntryPriceAndFee({
        collateral,
        size,
        side: side === "Long" ? { long: {} } : { short: {} },
      })
      .accounts({
        perpetuals: PERPETUALS_ADDRESS,
        pool: pool.address,
        custody: custody.address,
        custodyOracleAccount: custody.oracle.oracleAccount,
      })
      .transaction();

    const result = await this.simulateTransaction(transaction);
    const index = PERPETUALS_IDL.instructions.findIndex(
      (f) => f.name === "getEntryPriceAndFee",
    );
    const res = this.decodeLogs<{
      liquidationPrice: BN;
      entryPrice: BN;
      fee: BN;
    }>(result, index);
    return {
      liquidationPrice: res.liquidationPrice,
      entryPrice: res.entryPrice,
      fee: res.fee,
    };
  };

  getExitPriceAndFee = async (position: PositionAccount) => {
    const program = new Program(
      PERPETUALS_IDL,
      PERPETUALS_PROGRAM_ID,
      this.provider,
    );

    const transaction = await program.methods
      .getExitPriceAndFee({})
      .accounts({
        perpetuals: PERPETUALS_ADDRESS,
        pool: position.pool,
        position: position.address,
        custody: position.custody,
        custodyOracleAccount: position.oracleAccount,
      })
      .transaction();

    const result = await this.simulateTransaction(transaction);
    const index = PERPETUALS_IDL.instructions.findIndex(
      (f) => f.name === "getExitPriceAndFee",
    );
    const res = this.decodeLogs<{
      price: BN;
      fee: BN;
    }>(result, index);

    return {
      price: res.price,
      fee: res.fee,
    };
  };

  getLiquidationPrice = async (
    position: PositionAccount,
    custody?: CustodyAccount,
    addCollat?: number,
    removeCollat?: number,
  ) => {
    const program = new Program(
      PERPETUALS_IDL,
      PERPETUALS_PROGRAM_ID,
      this.provider,
    );

    const addCollateral =
      typeof addCollat !== "undefined" && typeof custody !== "undefined"
        ? new BN(addCollat * 10 ** custody.decimals)
        : new BN(0);
    const removeCollateral =
      typeof removeCollat !== "undefined" && typeof custody !== "undefined"
        ? new BN(removeCollat * 10 ** custody.decimals)
        : new BN(0);
    let params = {};

    if (addCollateral.gt(new BN(0)) || removeCollateral.gt(new BN(0))) {
      params = { addCollateral, removeCollateral };
    }
    const transaction = await program.methods
      // @ts-ignore
      .getLiquidationPrice(params)
      .accounts({
        perpetuals: PERPETUALS_ADDRESS,
        pool: position.pool,
        position: position.address,
        custody: position.custody,
        custodyOracleAccount: position.oracleAccount,
      })
      .transaction();
    const result = await this.simulateTransaction(transaction);
    const index = PERPETUALS_IDL.instructions.findIndex(
      (f) => f.name === "getLiquidationPrice",
    );
    return this.decodeLogs<BN>(result, index);
  };

  getLiquidationState = async (position: PositionAccount) => {
    const program = new Program(
      PERPETUALS_IDL,
      PERPETUALS_PROGRAM_ID,
      this.provider,
    );
    const transaction = await program.methods
      .getLiquidationState({})
      .accounts({
        perpetuals: PERPETUALS_ADDRESS,
        pool: position.pool,
        position: position.address,
        custody: position.custody,
        custodyOracleAccount: position.oracleAccount,
      })
      .transaction();

    const result = await this.simulateTransaction(transaction);
    const index = PERPETUALS_IDL.instructions.findIndex(
      (f) => f.name === "getLiquidationState",
    );
    return this.decodeLogs<BN>(result, index);
  };

  getPnl = async (position: PositionAccount) => {
    // const { perpetual_program } =
    //   await getPerpetualProgramAndProvider(rpcEndpoint);
    const transaction = await this.program.methods
      .getPnl({})
      .accounts({
        perpetuals: PERPETUALS_ADDRESS,
        pool: position.pool,
        position: position.address,
        custody: position.custody,
        custodyOracleAccount: position.oracleAccount,
      })
      .transaction();

    const result = await this.simulateTransaction(transaction);
    const index = PERPETUALS_IDL.instructions.findIndex(
      (f) => f.name === "getPnl",
    );
    const res = this.decodeLogs<{
      profit: BN;
      loss: BN;
    }>(result, index);
    return {
      profit: res.profit,
      loss: res.loss,
    };
  };

  getSwapAmountAndFees = async (
    amtIn: number,
    pool: PoolAccount,
    receivingCustody: CustodyAccount,
    dispensingCustody: CustodyAccount,
  ) => {
    const program = new Program(
      PERPETUALS_IDL,
      PERPETUALS_PROGRAM_ID,
      this.provider,
    );
    const amountIn = new BN(amtIn * 10 ** receivingCustody.decimals);
    const transaction = await program.methods
      // @ts-ignore
      .getSwapAmountAndFees({
        amountIn,
      })
      .accounts({
        perpetuals: PERPETUALS_ADDRESS,
        pool: pool.address,
        receivingCustody: receivingCustody.address,
        receivingCustodyOracleAccount: receivingCustody.oracle.oracleAccount,
        dispensingCustody: dispensingCustody.address,
        dispensingCustodyOracleAccount: dispensingCustody.oracle.oracleAccount,
      })
      .transaction();
    const result = await this.simulateTransaction(transaction);
    const index = PERPETUALS_IDL.instructions.findIndex(
      (f) => f.name === "getSwapAmountAndFees",
    );
    const res = this.decodeLogs<{
      amountOut: BN;
      feeIn: BN;
      feeOut: BN;
    }>(result, index);
    return {
      amountOut: res.amountOut,
      feeIn: res.feeIn,
      feeOut: res.feeOut,
    };
  };

  getAddLiquidityAmountAndFees = async (
    amtIn: number,
    pool: PoolAccount,
    custody: CustodyAccount,
  ) => {
    const program = new Program(
      PERPETUALS_IDL,
      PERPETUALS_PROGRAM_ID,
      this.provider,
    );
    const amountIn = new BN(amtIn * 10 ** custody.decimals);
    const transaction = await program.methods
      .getAddLiquidityAmountAndFee({
        amountIn,
      })
      .accounts({
        perpetuals: PERPETUALS_ADDRESS,
        pool: pool.address,
        custody: custody.address,
        custodyOracleAccount: custody.oracle.oracleAccount,
        lpTokenMint: pool.getLpTokenMint(),
      })
      .remainingAccounts(pool.getCustodyMetas())
      .transaction();
    const result = await this.simulateTransaction(transaction);
    const index = PERPETUALS_IDL.instructions.findIndex(
      (f) => f.name === "getAddLiquidityAmountAndFee",
    );
    const res = this.decodeLogs<{
      amount: BN;
      fee: BN;
    }>(result, index);
    return {
      amount: res.amount,
      fee: res.fee,
    };
  };

  getRemoveLiquidityAmountAndFees = async (
    lpIn: number,
    pool: PoolAccount,
    custody: CustodyAccount,
  ) => {
    const program = new Program(
      PERPETUALS_IDL,
      PERPETUALS_PROGRAM_ID,
      this.provider,
    );
    const lpAmountIn = new BN(lpIn * 10 ** pool.lpData.decimals);
    const transaction = await program.methods
      .getRemoveLiquidityAmountAndFee({
        lpAmountIn,
      })
      .accounts({
        perpetuals: PERPETUALS_ADDRESS,
        pool: pool.address,
        custody: custody.address,
        custodyOracleAccount: custody.oracle.oracleAccount,
        lpTokenMint: pool.getLpTokenMint(),
      })
      .remainingAccounts(pool.getCustodyMetas())
      .transaction();
    const result = await this.simulateTransaction(transaction);
    const index = PERPETUALS_IDL.instructions.findIndex(
      (f) => f.name === "getRemoveLiquidityAmountAndFee",
    );
    const res = this.decodeLogs<{
      amount: BN;
      fee: BN;
    }>(result, index);
    return {
      amount: res.amount,
      fee: res.fee,
    };
  };

  getOraclePrice = async (
    pool: PoolAccount,
    ema: boolean,
    custody: CustodyAccount,
  ) => {
    const transaction = await this.program.methods
      .getOraclePrice({
        ema,
      })
      .accounts({
        perpetuals: PERPETUALS_ADDRESS,
        pool: pool.address,
        custody: custody.address,
        custodyOracleAccount: custody.oracle.oracleAccount,
      })
      .transaction();
    const result = await this.simulateTransaction(transaction);
    const index = PERPETUALS_IDL.instructions.findIndex(
      (f) => f.name === "getOraclePrice",
    );
    return this.decodeLogs<BN>(result, index);
  };
}

export { ViewHelper };
