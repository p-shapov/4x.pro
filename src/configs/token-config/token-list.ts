const tokenList = ["Sol_BTC", "Sol_ETH", "Sol_USDC", "Sol_SOL"] as const;
type Token = (typeof tokenList)[number];

export { tokenList };
export type { Token };
