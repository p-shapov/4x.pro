import { useWallet } from "@solana/wallet-adapter-react";
import type { FC } from "react";

import { Icon } from "@4x.pro/ui-kit/icon";

import { mkNoDataFallbackStyles } from "./styles";
import { Wallet } from "../wallet";

type Props = {
  iconSrc: `/icons/${string}.svg`;
  message: string;
  showConnect?: boolean;
};

const NoDataFallback: FC<Props> = ({ iconSrc, message, showConnect }) => {
  const walletContextState = useWallet();
  const noDataFallbackStyles = mkNoDataFallbackStyles();
  return (
    <div className={noDataFallbackStyles.root}>
      <span className={noDataFallbackStyles.message}>
        <Icon src={iconSrc} className={noDataFallbackStyles.icon} />
        <span className={noDataFallbackStyles.text}>{message}</span>
      </span>
      {!walletContextState.connected && showConnect && (
        <Wallet.Connect variant="accent" />
      )}
    </div>
  );
};

export { NoDataFallback };
