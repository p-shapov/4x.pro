import { Popover } from "@headlessui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";

import { useTokenBalance } from "@4x.pro/shared/hooks/use-token-balance";
import { formatCurrency_SOL } from "@4x.pro/shared/utils/number";
import { trim } from "@4x.pro/shared/utils/string";
import { Icon } from "@4x.pro/ui-kit/icon";

import { mkAccountButtonStyles } from "./styles";

const AccountButton: FC = () => {
  const accountButtonStyles = mkAccountButtonStyles();
  const { connection } = useConnection();
  const { wallet, publicKey } = useWallet();
  const balance = useTokenBalance(connection)({
    variables: {
      token: "SOL",
      publicKeyBase58: publicKey?.toBase58(),
    },
  });
  if (!publicKey || !wallet) return null;
  return (
    <Popover>
      <Popover.Button className={accountButtonStyles.button}>
        {({ open }) => (
          <>
            <img
              className={accountButtonStyles.walletIcon}
              src={wallet.adapter.icon}
              alt={wallet.adapter.name}
            />
            <span className={accountButtonStyles.balance}>
              {formatCurrency_SOL(balance.data, 2)}
            </span>
            <span className={accountButtonStyles.address}>
              {trim(publicKey.toBase58(), 5, 4)}
            </span>
            <Icon
              src={open ? "/icons/arrow-up-1.svg" : "/icons/arrow-down-1.svg"}
              className={accountButtonStyles.arrowIcon}
            />
          </>
        )}
      </Popover.Button>
    </Popover>
  );
};

export { AccountButton };
