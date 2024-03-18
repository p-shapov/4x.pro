const BASE_TOKENS = [
  {
    account: "USDC_account",
    symbol: "USDC",
    uri: "https://placeholder.com/16x16",
  },
  {
    account: "SOV_account",
    symbol: "SOL",
    uri: "https://placeholder.com/16x16",
  },
  {
    account: "BTC_account",
    symbol: "BTC",
    uri: "https://placeholder.com/16x16",
  },
  {
    account: "ETH_account",
    symbol: "ETH",
    uri: "https://placeholder.com/16x16",
  },
];

const QUOTE_TOKEN = {
  account: "SOL_account",
  symbol: "SOL",
  uri: "https://placeholder.com/16x16",
};

const POSITIONS = [
  {
    txHash: "1",
    token: {
      account: "1",
      symbol: "Token 1",
      network: "solana",
      uri: "https://placeholder.com/16x16",
    },
    side: "short",
    leverage: 5,
    size: 100,
    collateral: 1000,
    pnl: 100,
    entryPrice: 100,
    markPrice: 100,
    liquidationPrice: 100,
  },
  {
    txHash: "2",
    token: {
      account: "2",
      symbol: "Token 2",
      network: "solana",
      uri: "https://placeholder.com/16x16",
    },
    side: "long",
    leverage: 5,
    size: 100,
    collateral: 1000,
    pnl: 100,
    entryPrice: 100,
    markPrice: 100,
    liquidationPrice: 100,
  },
  {
    txHash: "3",
    token: {
      account: "3",
      symbol: "Token 3",
      network: "solana",
      uri: "https://placeholder.com/16x16",
    },
    side: "short",
    leverage: 5,
    size: 100,
    collateral: 1000,
    pnl: 100,
    entryPrice: 100,
    markPrice: 100,
    liquidationPrice: 100,
  },
  {
    txHash: "4",
    token: {
      account: "4",
      symbol: "Token 4",
      network: "solana",
      uri: "https://placeholder.com/16x16",
    },
    side: "long",
    leverage: 5,
    size: 100,
    collateral: 1000,
    pnl: 100,
    entryPrice: 100,
    markPrice: 100,
    liquidationPrice: 100,
  },
] as const;

export { BASE_TOKENS, QUOTE_TOKEN, POSITIONS };
