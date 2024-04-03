/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Idl } from "@project-serum/anchor";
import type { MethodsBuilder } from "@project-serum/anchor/dist/cjs/program/namespace/methods";
import type { AllInstructions } from "@project-serum/anchor/dist/cjs/program/namespace/types";
import type { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { toast } from "react-toastify";

import { sleep } from "./promise";
import { getNowUnix } from "./time";

const TRX_URL = (txid: string) =>
  `https://explorer.solana.com/tx/${txid}?cluster=devnet`;

const ACCOUNT_URL = (address: string) =>
  `https://explorer.solana.com/address/${address}?cluster=devnet`;

const automaticSendTransaction = async <
  IDL extends Idl,
  I extends AllInstructions<IDL>,
>(
  methodBuilder: MethodsBuilder<IDL, I>,
  connection: Connection,
) => {
  const successMessage = "Transaction success!";
  const failMessage = "Transaction failed";
  await sendAnchorTransactionAndNotify({
    methodBuilder,
    connection,
    successMessage,
    failMessage,
  });
};

const sendAnchorTransactionAndNotify = async <
  IDL extends Idl,
  I extends AllInstructions<IDL>,
>({
  methodBuilder,
  connection,
  successMessage,
  failMessage,
}: {
  methodBuilder: MethodsBuilder<IDL, I>;
  connection: Connection;
  successMessage: string;
  failMessage: string;
}) => {
  const txid = "temptx";
  await new Promise(function (resolve, reject) {
    toast.promise(
      (async () => {
        try {
          const txid = await methodBuilder.rpc();
          await connection.confirmTransaction(txid, "confirmed");
          resolve(true);
        } catch (error) {
          reject(error);
          throw error;
        }
      })(),
      {
        pending: {
          render() {
            return "Processing transaction";
          },
        },
        success: {
          render() {
            return successMessage;
          },
          icon: false,
        },
        error: {
          render() {
            return failMessage;
          },
          icon: false,
        },
      },
    );
  });
  return txid;
};

const manualSendTransaction = async (
  transaction: Transaction,
  publicKey: PublicKey,
  connection: Connection,
  signTransaction: any,
  successMessage?: string,
  failMessage?: string,
) => {
  // try {
  transaction.feePayer = publicKey;
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash("finalized")
  ).blockhash;

  await sendSignedTransactionAndNotify({
    connection,
    transaction,
    successMessage: successMessage ?? "",
    failMessage: failMessage ?? "",
    signTransaction,
    enableSigning: true,
  });
};

const sendSignedTransactionAndNotify = async ({
  connection,
  transaction,
  successMessage,
  failMessage,
  signTransaction,
  enableSigning = true,
}: {
  connection: Connection;
  transaction: Transaction;
  successMessage: string;
  failMessage: string;
  signTransaction: any;
  enableSigning: boolean;
}) => {
  if (!transaction) {
    throw Error("no transaction");
  }
  const { txid, rawTransaction } = await sendTransaction({
    connection,
    transaction,
    wallet: { signTransaction },
    enableSigning,
  });
  await new Promise(function (resolve, reject) {
    toast.promise(
      (async () => {
        try {
          await sendRawTransaction({ connection, txid, rawTransaction });
          resolve(true);
        } catch (error) {
          reject(error);
          throw error;
        }
      })(),
      {
        pending: {
          render() {
            return "processing";
          },
        },
        success: {
          render() {
            return successMessage;
          },
          icon: false,
        },
        error: {
          render() {
            return failMessage;
          },
          icon: false,
        },
      },
      {
        position: "bottom-left",
        autoClose: 4000,
        className: "processing-transaction",
      },
    );
  });
  return txid;
};

const sendTransaction = async ({
  connection,
  transaction,
  wallet,
  enableSigning = true,
}: {
  connection: Connection;
  transaction: Transaction;
  wallet: any;
  enableSigning: boolean;
}) => {
  if (!transaction.recentBlockhash) {
    const hash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = hash.blockhash;
  }
  if (enableSigning) {
    transaction = await wallet.signTransaction(transaction);
  }
  const rawTransaction = transaction.serialize();

  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
  });
  return { txid, rawTransaction };
};

const awaitTransactionSignatureConfirmation = async ({
  connection,
  txid,
  timeout,
  confirmations = 1,
}: {
  connection: Connection;
  txid: string;
  timeout: number;
  confirmations: number;
}) => {
  let done = false;
  const result = await new Promise((resolve, reject) => {
    (async () => {
      setTimeout(() => {
        if (done) {
          return;
        }
        done = true;
        reject({ timeout: true });
      }, timeout);

      while (!done) {
        (async () => {
          try {
            const signatureStatuses = await connection.getSignatureStatuses([
              txid,
            ]);
            const result = signatureStatuses && signatureStatuses.value[0];
            if (!done) {
              if (!result) {
              } else if (result.err) {
                done = true;
                reject(result.err);
              }
              // @ts-ignore
              else if (
                !(
                  (result.confirmations &&
                    result.confirmations >= confirmations) ||
                  result.confirmationStatus === "finalized"
                )
              ) {
              } else {
                done = true;
                resolve(result);
              }
            }
          } catch (e) {}
        })();
        await sleep(1000);
      }
    })();
  });
  done = true;
  return result;
};

const sendRawTransaction = async ({
  connection,
  txid,
  rawTransaction,
}: {
  connection: Connection;
  txid: string;
  rawTransaction: any;
}) => {
  const timeout = 60000;
  const startTime = getNowUnix();
  let done = false;
  (async () => {
    await sleep(1000);
    while (!done && getNowUnix() - startTime < timeout) {
      connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
      });
      await sleep(1000);
    }
  })();
  try {
    await awaitTransactionSignatureConfirmation({
      connection,
      txid,
      timeout,
      confirmations: 10,
    });
  } catch (err) {
    const errString = JSON.stringify(err, null, 2);
    const logString = JSON.stringify(
      (await connection.getTransaction(txid))?.meta?.logMessages,
      null,
      2,
    );
    // @ts-ignore
    if (err.timeout) {
      throw new Error("Transaction timed out");
    }
    throw new Error(
      // @ts-ignore
      "Transaction Failed : " + (err.message || `${errString}\n${logString}`),
    );
  } finally {
    done = true;
  }
};

export {
  automaticSendTransaction,
  manualSendTransaction,
  sendSignedTransactionAndNotify,
  sendAnchorTransactionAndNotify,
  awaitTransactionSignatureConfirmation,
  sendTransaction,
  sendRawTransaction,
  TRX_URL,
  ACCOUNT_URL,
};
