import { getAssociatedTokenAddress } from "@solana/spl-token";
import type { Connection } from "@solana/web3.js";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import type { Token } from "@4x.pro/app-config";
import { getTokenPublicKey } from "@4x.pro/app-config";

const checkIfAccountExists = async (
  account: PublicKey,
  connection: Connection,
) => {
  const bal = await connection.getBalance(account);
  return bal > 0;
};

const fetchSplTokenBalance = async (
  token: Token,
  account: string,
  connection: Connection,
) => {
  if (token === "SOL") {
    return (
      (await connection.getBalance(new PublicKey(account))) / LAMPORTS_PER_SOL
    );
  }
  const tokenATA = await getAssociatedTokenAddress(
    new PublicKey(getTokenPublicKey(token)),
    new PublicKey(account),
  );
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
