import type { Connection } from "@solana/web3.js";
import { createQuery } from "react-query-kit";

import type { Token } from "@4x.pro/configs/dex-platform";

import { fetchSplTokenBalance } from "../utils/retrieve-data";

const useTokenBalance = (connection: Connection) => {
  return createQuery({
    queryKey: ["token-balance"],
    fetcher: async ({
      token,
      account,
    }: {
      token?: Token;
      account?: string;
    }) => {
      if (!account || !token) return null;
      return fetchSplTokenBalance(token, account, connection);
    },
  });
};

export { useTokenBalance };
