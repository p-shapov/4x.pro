import type { Token } from "./config";

const pythFeedIds_to_USD: Record<Token, string> = {
  SOL: "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix",
  USDC: "5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7",
  LP: "",
};

const publicKeys: Record<Token, string> = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  LP: "",
};

const mainnetConfig = {
  pythFeedIds_to_USD,
  publicKeys,
};

export { mainnetConfig };
