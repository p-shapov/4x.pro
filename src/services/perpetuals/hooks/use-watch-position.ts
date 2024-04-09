import type { AccountInfo, Context } from "@solana/web3.js";
import { useEffect } from "react";

import { useAppConfig } from "@4x.pro/app-config";

import type { PositionAccount } from "../lib/position-account";
import { getPerpetualProgramAndProvider } from "../utils/constants";

const useWatchPosition = ({
  position,
  listener,
}: {
  position: PositionAccount;
  listener: (accountInfo: AccountInfo<Buffer>, ctx: Context) => void;
}) => {
  const { rpcEndpoint } = useAppConfig();
  useEffect(() => {
    const { perpetual_program } = getPerpetualProgramAndProvider(rpcEndpoint);
    // Raw subscribe
    const subId = perpetual_program.provider.connection.onAccountChange(
      position.address,
      listener,
    );
    return () => {
      perpetual_program.provider.connection.removeAccountChangeListener(subId);
    };
  }, [listener, position, rpcEndpoint]);
};

export { useWatchPosition };
