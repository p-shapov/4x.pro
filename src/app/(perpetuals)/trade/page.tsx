"use client";
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect } from "react";
import type { FC } from "react";

import { useAppConfig } from "@4x.pro/app-config";
import { TradeModule } from "@4x.pro/modules/trade";

const TradePage: FC = () => {
  const { rpcEndpoint } = useAppConfig();
  useEffect(() => {
    (async () => {
      const connection = new Connection(rpcEndpoint, "finalized");
      const signatures = await connection.getSignaturesForAddress(
        new PublicKey("JAxwfejiqFT3KZ3DkmGrn5jSK83ygBPFUuK4HFAva4n6"),
        { limit: 10 },
        "finalized",
      );
      const transactions = await connection.getParsedTransactions(
        signatures.map((s) => s.signature),
        "finalized",
      );
      console.log("transaction", transactions);
    })();
  }, [rpcEndpoint]);
  return <TradeModule />;
};

export default TradePage;
