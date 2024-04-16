import { devnetConfig } from "./config.devnet";
import { mainnetConfig } from "./config.mainnet";

const rpcProviders = ["helius"] as const;
type RpcProvider = (typeof rpcProviders)[number];

const tokenList = ["USDC", "SOL", "LTC", "LP"] as const;
const payTokens = tokenList.filter((token) => token !== "LP");
const collateralTokens = tokenList.filter(
  (token) => token !== "LP" && token !== "USDC",
);
const receiveTokens = tokenList.filter((token) => token !== "LP");
type Token = (typeof tokenList)[number];

type Config = {
  rpcEndpoints: Record<RpcProvider, string>;
  tickerSymbols: Partial<Record<Token, string>>;
  pythTickerSymbols: Partial<Record<Token, string>>;
  pythFeedIds_to_USD: Partial<Record<Token, string>>;
  tokenLogos: Partial<Record<Token, `/coins/${string}.svg`>>;
  tokenSymbols: Record<Token, string>;
  tokenNetworks: Record<Token, string>;
  tokenIds: Record<Token, string>;
  publicKeys: Partial<Record<Token, string>>;
};

const tickerSymbols: Partial<Record<Token, string>> = {
  SOL: "Crypto.SOL/USD",
  USDC: "Crypto.USDC/USD",
  LTC: "Crypto.LTC/USD",
};

const pythTickerSymbols: Partial<Record<Token, string>> = {
  SOL: "PYTH:SOLUSD",
  USDC: "PYTH:USDCUSD",
  LTC: "PYTH:LTCUSD",
};

const tokenLogos: Partial<Record<Token, `/coins/${string}.svg`>> = {
  SOL: "/coins/SOL.svg",
  USDC: "/coins/USDC.svg",
  LTC: "/coins/LTC.svg",
};

const tokenSymbols: Record<Token, string> = {
  SOL: "SOL",
  USDC: "USDC",
  LTC: "LTC",
  LP: "LP",
};

const tokenNetworks: Record<Token, string> = {
  SOL: "Solana",
  USDC: "Solana",
  LTC: "Solana",
  LP: "Solana",
};

const tokenIds: Record<Token, string> = {
  SOL: "solana",
  USDC: "usd-coin",
  LTC: "litecoin",
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
  collateralTokens,
  payTokens,
  receiveTokens,
};
