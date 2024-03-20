"use client";
import {
  PythConnection,
  getPythProgramKeyForCluster,
  PythHttpClient,
} from "@pythnetwork/client";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

import { Network } from "./wallet-adapter-config";

const endpoint = clusterApiUrl(Network);
const pythProgramKey = getPythProgramKeyForCluster(Network);
const httpConnection = new Connection(endpoint);
const pythHttpClient = new PythHttpClient(
  httpConnection,
  pythProgramKey,
  httpConnection.commitment,
);
const createPythConnectionForFeedId = (feedId: string) =>
  new PythConnection(
    httpConnection,
    pythProgramKey,
    httpConnection.commitment,
    [new PublicKey(feedId)],
  );

export { pythHttpClient, createPythConnectionForFeedId };
