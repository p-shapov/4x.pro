import type { Connection } from "@solana/web3.js";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { createQuery } from "react-query-kit";

const useAccountBalance = (connection: Connection) => {
  return createQuery({
    queryKey: ["accountBalance"],
    fetcher: async ({ publicKey }: { publicKey?: string | null }) => {
      if (!publicKey || !connection) return;
      const balance = await connection.getBalance(
        new PublicKey(publicKey),
        "confirmed",
      );
      if (typeof balance === "number") return balance / LAMPORTS_PER_SOL;
      return balance;
    },
  });
};

export { useAccountBalance };
