import { useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";

import { BalancesTable } from "@4x.pro/components/balances-table";
import { tokenList } from "@4x.pro/configs/dex-platform";

const UserBalances: FC = () => {
  const { publicKey } = useWallet();
  return <BalancesTable publicKey={publicKey} tokenList={tokenList} />;
};

export { UserBalances };
