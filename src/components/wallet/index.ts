"use client";
import { AccountButton } from "./account-button";
import { ConnectButton } from "./connect-button";
import { WalletsDialog } from "./wallets-dialog";

const Wallet = {
  Dialog: WalletsDialog,
  Connect: ConnectButton,
  Account: AccountButton,
};

export { Wallet };
