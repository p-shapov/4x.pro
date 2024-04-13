/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";
import { BN } from "bn.js";

import { manualSendTransaction } from "@4x.pro/services/transaction-flow/handlers";

import type { PoolAccount } from "../lib/pool-account";
import type { PositionAccount } from "../lib/position-account";
import type { OrderTxType } from "../lib/types";
import {
  PERPETUALS_ADDRESS,
  getPerpetualProgramAndProvider,
} from "../utils/constants";

const updateOrder = async (
  type: OrderTxType,
  rpcEndpoint: string,
  connection: Connection,
  walletContextState: WalletContextState,
  pool: PoolAccount,
  position: PositionAccount,
  triggerPrice: number | null,
) => {
  const { perpetual_program } = await getPerpetualProgramAndProvider(
    rpcEndpoint,
    walletContextState,
  );
  const publicKey = walletContextState.publicKey!;
  const custody = pool.getCustodyAccount(position.token)!;
  let methodBuilder;
  const finalTriggerPrice =
    typeof triggerPrice === "number" ? new BN(triggerPrice * 10 ** 6) : null;

  switch (type) {
    case "stop-loss": {
      methodBuilder = perpetual_program.methods
        .updatePositionLimits({
          stopLoss: finalTriggerPrice,
          takeProfit: position.takeProfit,
        })
        .accounts({
          owner: publicKey,
          perpetuals: PERPETUALS_ADDRESS,
          pool: pool.address,
          position: position.address,
          custody: custody.address,
        });
    }
    case "take-profit": {
      methodBuilder = perpetual_program.methods
        .updatePositionLimits({
          takeProfit: finalTriggerPrice,
          stopLoss: position.takeProfit,
        })
        .accounts({
          owner: publicKey,
          perpetuals: PERPETUALS_ADDRESS,
          pool: pool.address,
          position: position.address,
          custody: custody.address,
        });
    }
  }

  const tx = await methodBuilder.transaction();
  return await manualSendTransaction(
    tx,
    publicKey,
    connection,
    walletContextState.signTransaction,
    "Update limit",
  );
};

export { updateOrder };
