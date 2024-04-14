import type { Token } from "./config";

const pythFeedIds_to_USD: Record<Token, string> = {
  SOL: "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix",
  USDC: "5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7",
  BTC: "HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J",
  LP: "",
};

const publicKeys: Record<Token, string> = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
  BTC: "6QGdQbaZEgpXqqbGwXJZXwbZ9xJnthfyYNZ92ARzTdAX",
  LP: "",
};

const devnetConfig = {
  pythFeedIds_to_USD,
  publicKeys,
};

export { devnetConfig };
