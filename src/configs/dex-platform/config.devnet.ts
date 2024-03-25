import type { Token } from "./config";

const pythFeedIds_to_USD: Record<Token, string> = {
  SOL: "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix",
  USDC: "5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7",
  BTC: "HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J",
  ETH: "EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw",
};

const splTokenAddresses: Record<Token, string> = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
  BTC: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
  ETH: "Ff5JqsAYUD4vAfQUtfRprT4nXu9e28tTBZTDFMnJNdvd",
};

const devnetConfig = {
  pythFeedIds_to_USD,
  splTokenAddresses,
};

export { devnetConfig };
