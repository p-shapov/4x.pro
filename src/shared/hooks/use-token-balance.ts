import type { Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { createQuery } from "react-query-kit";

import type { Token } from "@4x.pro/configs/dex-platform";

import { fetchSplTokenBalance } from "../utils/retrieve-data";

const useTokenBalance = (connection: Connection) => {
  return createQuery({
    queryKey: ["token-balance"],
    fetcher: async ({
      token,
      publicKeyBase58,
    }: {
      token?: Token;
      publicKeyBase58?: string;
    }) => {
      if (!publicKeyBase58 || !token) return null;
      return fetchSplTokenBalance(
        token,
        new PublicKey(publicKeyBase58),
        connection,
      );
    },
  });
};

export { useTokenBalance };
