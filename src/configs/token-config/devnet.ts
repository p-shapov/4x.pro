import type { Token } from "./token-list";

const PythFeedIds_to_USD: Record<Token, string> = {
  Sol_SOL: "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix",
  Sol_USDC: "5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7",
  Sol_BTC: "HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J",
  Sol_ETH: "EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw",
};

const devnetConfig = {
  PythFeedIds_to_USD,
};

export { devnetConfig };
