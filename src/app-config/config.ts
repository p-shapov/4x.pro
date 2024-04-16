import { devnetConfig } from "./config.devnet";
import { mainnetConfig } from "./config.mainnet";

const rpcProviders = ["helius"] as const;
type RpcProvider = (typeof rpcProviders)[number];

const coinList = ["USDC", "SOL"] as const;
type Coin = (typeof coinList)[number];
const tokenList = [...coinList, "LP"] as const;
type Token = (typeof tokenList)[number];

type Config = {
  rpcEndpoints: Record<RpcProvider, string>;
  tickerSymbols: Record<Coin, string>;
  pythTickerSymbols: Record<Coin, string>;
  pythFeedIds_to_USD: Record<Coin, string>;
  tokenLogos: Partial<Record<Token, `/coins/${string}.svg`>>;
  tokenSymbols: Record<Token, string>;
  tokenNetworks: Record<Token, string>;
  tokenIds: Record<Token, string>;
  publicKeys: Record<Coin, string>;
};

const tickerSymbols: Record<Coin, string> = {
  SOL: "Crypto.SOL/USD",
  USDC: "Crypto.USDC/USD",
};

const pythTickerSymbols: Record<Coin, string> = {
  SOL: "PYTH:SOLUSD",
  USDC: "PYTH:USDCUSD",
};

const tokenLogos: Partial<Record<Token, `/coins/${string}.svg`>> = {
  SOL: "/coins/SOL.svg",
  USDC: "/coins/USDC.svg",
};

const tokenSymbols: Record<Token, string> = {
  SOL: "SOL",
  USDC: "USDC",
  LP: "LP",
};

const tokenNetworks: Record<Token, string> = {
  SOL: "Solana",
  USDC: "Solana",
  LP: "Solana",
};

const tokenIds: Record<Token, string> = {
  SOL: "solana",
  USDC: "usd-coin",
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

export type { Token, Coin, RpcProvider };
export { DexPlatformConfig, coinList, tokenList, rpcProviders };
