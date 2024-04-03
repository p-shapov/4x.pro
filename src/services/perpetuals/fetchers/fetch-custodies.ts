/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { PublicKey } from "@solana/web3.js";

import { CustodyAccount } from "../lib/custody-account";
import type { Custody } from "../lib/types";
import { getPerpetualProgramAndProvider } from "../utils/constants";

interface FetchCustody {
  account: Custody;
  publicKey: PublicKey;
}

const getCustodyData = async (rpcEndpoint: string) => {
  const { perpetual_program } =
    await getPerpetualProgramAndProvider(rpcEndpoint);

  let fetchedCustodies: FetchCustody[];
  try {
    // @ts-ignore
    fetchedCustodies = await perpetual_program.account.custody.all();
  } catch {
    fetchedCustodies = [];
  }

  const custodyInfos: Record<string, CustodyAccount> = fetchedCustodies.reduce(
    (acc: Record<string, CustodyAccount>, { account, publicKey }) => (
      (acc[publicKey.toString()] = new CustodyAccount(account, publicKey)), acc
    ),
    {},
  );

  return custodyInfos;
};

export { getCustodyData };
