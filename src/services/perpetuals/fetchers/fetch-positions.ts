/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { PublicKey } from "@solana/web3.js";

import type { CustodyAccount } from "../lib/custody-account";
import { PositionAccount } from "../lib/position-account";
import type { Position } from "../lib/types";
import { getPerpetualProgramAndProvider } from "../utils/constants";

interface FetchPosition {
  account: Position;
  publicKey: PublicKey;
}

const getPositionData = async (
  rpcEndpoint: string,
  custodyInfos: Record<string, CustodyAccount>,
) => {
  const { perpetual_program } =
    await getPerpetualProgramAndProvider(rpcEndpoint);

  // @ts-ignore
  const fetchedPositions: FetchPosition[] =
    await perpetual_program.account.position.all([{ dataSize: 232 }]);

  const positionInfos: Record<string, PositionAccount> =
    fetchedPositions.reduce(
      (acc: Record<string, PositionAccount>, position: FetchPosition) => (
        (acc[position.publicKey.toString()] = new PositionAccount(
          position.account,
          position.publicKey,
          custodyInfos,
        )),
        acc
      ),
      {},
    );

  return positionInfos;
};

export { getPositionData };
