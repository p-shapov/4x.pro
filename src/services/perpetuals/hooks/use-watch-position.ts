import { useEffect } from "react";

import type { PositionAccount } from "../lib/position-account";
import { getPerpetualProgramAndProvider } from "../utils/constants";

const useWatchPosition = ({
  rpcEndpoint,
  position,
  listener,
}: {
  rpcEndpoint: string;
  position: PositionAccount;
  listener: (newPosition: PositionAccount) => void;
}) => {
  useEffect(() => {
    const { perpetual_program } = getPerpetualProgramAndProvider(rpcEndpoint);
    const emitter = perpetual_program.account.position.subscribe(
      position.address,
    );
    emitter.on("change", listener);
    return () => {
      emitter.off("change", listener);
    };
  }, [listener, position, rpcEndpoint]);
};

export { useWatchPosition };
