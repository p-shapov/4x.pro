const tokenList = ["BTC", "ETH", "USDC", "SOL"] as const;
type Token = (typeof tokenList)[number];

export { tokenList };
export type { Token };
