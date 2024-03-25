import { getAssociatedTokenAddress } from "@solana/spl-token";
import type { Connection } from "@solana/web3.js";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import type { Token } from "@4x.pro/configs/dex-platform";
import { getSplTokenAddress } from "@4x.pro/configs/dex-platform";

const checkIfAccountExists = async (
  account: PublicKey,
  connection: Connection,
) => {
  const bal = await connection.getBalance(account);
  return bal > 0;
};

const fetchSplTokenBalance = async (
  token: Token,
  publicKey: PublicKey,
  connection: Connection,
) => {
  const tokenATA = await getAssociatedTokenAddress(
    new PublicKey(getSplTokenAddress(token)),
    publicKey,
  );
  if (token === "SOL") {
    return (await connection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
  }
  if (await checkIfAccountExists(tokenATA, connection)) {
    return (await connection.getTokenAccountBalance(tokenATA)).value.uiAmount;
  }
  return null;
};

const fetchLPBalance = async (
  address: PublicKey,
  publicKey: PublicKey,
  connection: Connection,
) => {
  const lpTokenATA = await getAssociatedTokenAddress(address, publicKey);
  if (await checkIfAccountExists(lpTokenATA, connection)) {
    const balance = await connection.getTokenAccountBalance(lpTokenATA);
    return balance.value.uiAmount!;
  }
  return 0;
};

export { fetchSplTokenBalance, fetchLPBalance };
