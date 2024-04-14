import { devnetConfig } from "./config.devnet";
import { mainnetConfig } from "./config.mainnet";

const rpcProviders = ["helius"] as const;
type RpcProvider = (typeof rpcProviders)[number];

const tokenList = ["BTC", "ETH", "USDC", "SOL", "LP"] as const;
type Token = (typeof tokenList)[number];
const depositTokens: readonly Token[] = ["BTC", "ETH", "USDC", "SOL"];
const collateralTokens: readonly Token[] = ["SOL", "ETH", "BTC"];

type Config = {
  rpcEndpoints: Record<RpcProvider, string>;
  tickerSymbols: Record<Token, string>;
  pythTickerSymbols: Record<Token, string>;
  pythFeedIds_to_USD: Record<Token, string>;
  tokenLogos: Partial<Record<Token, `/coins/${string}.svg`>>;
  tokenSymbols: Record<Token, string>;
  tokenNetworks: Record<Token, string>;
  tokenIds: Record<Token, string>;
  publicKeys: Record<Token, string>;
};

const tickerSymbols: Record<Token, string> = {
  SOL: "Crypto.SOL/USD",
  USDC: "Crypto.USDC/USD",
  BTC: "Crypto.BTC/USD",
  ETH: "Crypto.ETH/USD",
  LP: "",
};

const pythTickerSymbols: Record<Token, string> = {
  SOL: "PYTH:SOLUSD",
  USDC: "PYTH:USDCUSD",
  BTC: "PYTH:BTCUSD",
  ETH: "PYTH:ETHUSD",
  LP: "",
};

const tokenLogos: Partial<Record<Token, `/coins/${string}.svg`>> = {
  BTC: "/coins/BTC.svg",
  ETH: "/coins/ETH.svg",
  SOL: "/coins/SOL.svg",
  USDC: "/coins/USDC.svg",
};

const tokenSymbols: Record<Token, string> = {
  SOL: "SOL",
  USDC: "USDC",
  BTC: "BTC",
  ETH: "ETH",
  LP: "LP",
};

const tokenNetworks: Record<Token, string> = {
  SOL: "Solana",
  USDC: "Solana",
  BTC: "Bitcoin",
  ETH: "Ethereum",
  LP: "Solana",
};

const tokenIds: Record<Token, string> = {
  SOL: "solana",
  USDC: "usd-coin",
  BTC: "bitcoin",
  ETH: "ethereum",
  LP: "liquidity-provider",
};

const DexPlatformConfig: Config = {
  tickerSymbols,
  pythTickerSymbols,
  tokenLogos,
  tokenSymbols,
  tokenNetworks,
  tokenIds,
  rpcEndpoints: {
    helius: `https://devnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
  },
  ...(process.env.NEXT_PUBLIC_IS_DEVNET === "true"
    ? devnetConfig
    : mainnetConfig),
};

export type { Token, RpcProvider };
export {
  DexPlatformConfig,
  tokenList,
  rpcProviders,
  depositTokens,
  collateralTokens,
};
