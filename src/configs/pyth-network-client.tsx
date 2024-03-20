"use client";
import {
  PythConnection,
  getPythProgramKeyForCluster,
  PythHttpClient,
} from "@pythnetwork/client";
import { Connection, PublicKey } from "@solana/web3.js";

import { networkConfig } from "./network-config";
import { tokenConfig } from "./token-config";

const pythProgramKey = getPythProgramKeyForCluster(
  process.env.NEXT_PUBLIC_IS_DEVNET === "true" ? "devnet" : "mainnet-beta",
);
const httpConnection = new Connection(networkConfig.NetworkRPCURLs.solana);
const pythHttpClient = new PythHttpClient(
  httpConnection,
  pythProgramKey,
  httpConnection.commitment,
);
const pythConnection = new PythConnection(
  httpConnection,
  pythProgramKey,
  httpConnection.commitment,
  Object.values(tokenConfig.PythFeedIds_to_USD).map(
    (feedId) => new PublicKey(feedId),
  ),
);
const createPythConnectionForFeedId = (feedId: string) =>
  new PythConnection(
    httpConnection,
    pythProgramKey,
    httpConnection.commitment,
    [new PublicKey(feedId)],
  );

export { pythHttpClient, pythConnection, createPythConnectionForFeedId };
