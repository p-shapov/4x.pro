import type { Token } from "./config";

const pythFeedIds_to_USD: Record<Token, string> = {
  SOL: "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix",
  USDC: "5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7",
  BTC: "HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J",
  ETH: "EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw",
};

const splTokenAddresses: Record<Token, string> = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  BTC: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
  ETH: "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk",
};

const mainnetConfig = {
  pythFeedIds_to_USD,
  splTokenAddresses,
};

export { mainnetConfig };
