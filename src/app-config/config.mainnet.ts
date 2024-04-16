import type { Token } from "./config";

const pythFeedIds_to_USD: Partial<Record<Token, string>> = {
  SOL: "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix",
  USDC: "5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7",
  LTC: "BLArYBCUYhdWiY8PCUTpvFE21iaJq85dvxLk9bYMobcU",
};

const publicKeys: Partial<Record<Token, string>> = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  LTC: "6QGdQbaZEgpXqqbGwXJZXwbZ9xJnthfyYNZ92ARzTdAX",
};

const mainnetConfig = {
  pythFeedIds_to_USD,
  publicKeys,
};

export { mainnetConfig };
