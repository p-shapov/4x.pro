import { offset, size, useFloating } from "@floating-ui/react-dom";
import { Menu } from "@headlessui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";

import { useTokenBalance } from "@4x.pro/shared/hooks/use-token-balance";
import { formatCurrency_SOL } from "@4x.pro/shared/utils/number";
import { trim } from "@4x.pro/shared/utils/string";
import { Icon } from "@4x.pro/ui-kit/icon";

import { mkAccountButtonStyles } from "./styles";

const AccountButton: FC = () => {
  const { refs, floatingStyles } = useFloating({
    middleware: [
      size({
        apply({ elements }) {
          elements.floating.style.width = `${
            elements.reference.getBoundingClientRect().width
          }px`;
        },
      }),
      offset({ mainAxis: 8 }),
    ],
  });
  const accountButtonStyles = mkAccountButtonStyles();
  const { connection } = useConnection();
  const { wallet, publicKey } = useWallet();
  const balance = useTokenBalance(connection)({
    variables: {
      token: "SOL",
      publicKeyBase58: publicKey?.toBase58(),
    },
  });
  const handleCopyAddress = async () => {
    if (publicKey) {
      const base58 = publicKey.toBase58();
      await navigator.clipboard.writeText(base58);
    }
  };
  const handleDisconnect = () => {
    wallet?.adapter.disconnect();
  };
  if (!publicKey || !wallet) return null;
  return (
    <Menu as="div" className={accountButtonStyles.root}>
      <Menu.Button
        ref={refs.setReference}
        className={accountButtonStyles.button}
      >
        {({ open }) => (
          <>
            <img
              className={accountButtonStyles.walletIcon}
              src={wallet.adapter.icon}
              alt={wallet.adapter.name}
              width={36}
              height={36}
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
      </Menu.Button>
      <Menu.Items
        ref={refs.setFloating}
        className={accountButtonStyles.menu}
        style={floatingStyles}
      >
        <Menu.Item
          as="button"
          className={accountButtonStyles.menuItem}
          onClick={handleCopyAddress}
        >
          <span>Copy address</span>
          <Icon
            className={accountButtonStyles.menuIcon}
            src="/icons/copy.svg"
          />
        </Menu.Item>
        <Menu.Item
          as="button"
          className={accountButtonStyles.menuItem}
          onClick={handleDisconnect}
        >
          <span>Disconnect</span>
          <Icon
            className={accountButtonStyles.menuIcon}
            src="/icons/logout.svg"
          />
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

export { AccountButton };
