import { useWallet } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";

import type { Token } from "@4x.pro/configs/dex-platform";

import { useTokenBalance } from "./use-token-balance";

const useIsInsufficientBalance =
  (connection: Connection) => (token: Token, amount: number) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { publicKey } = useWallet();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: balance } = useTokenBalance(connection)({
      variables: { token, account: publicKey?.toBase58() },
    });

    return typeof balance === "number" ? balance < amount : true;
  };

export { useIsInsufficientBalance };
