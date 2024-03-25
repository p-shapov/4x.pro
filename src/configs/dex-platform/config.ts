import { devnetConfig } from "./config.devnet";
import { mainnetConfig } from "./config.mainnet";

const rpcProviders = ["helius"] as const;
type RpcProvider = (typeof rpcProviders)[number];

const tokenList = ["BTC", "ETH", "USDC", "SOL"] as const;
type Token = (typeof tokenList)[number];

type Config = {
  rpcEndpoints: Record<RpcProvider, string>;
  tvSymbols: Record<Token, string>;
  pythFeedIds_to_USD: Record<Token, string>;
  tokenLogos: Partial<Record<Token, `/coins/${string}.svg`>>;
  tokenSymbols: Record<Token, string>;
};

const tvSymbols: Record<Token, string> = {
  SOL: "Crypto.SOL/USD",
  USDC: "Crypto.USDC/USD",
  BTC: "Crypto.BTC/USD",
  ETH: "Crypto.ETH/USD",
};

const tokenLogos: Partial<Record<Token, `/coins/${string}.svg`>> = {
  BTC: "/coins/BTC.svg",
  ETH: "/coins/ETH.svg",
};

const tokenSymbols: Record<Token, string> = {
  SOL: "SOL",
  USDC: "USDC",
  BTC: "BTC",
  ETH: "ETH",
};

const DexPlatformConfig: Config = {
  tvSymbols,
  tokenLogos,
  tokenSymbols,
  rpcEndpoints: {
    helius: `https://devnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
  },
  ...(process.env.NEXT_PUBLIC_IS_DEVNET === "true"
    ? devnetConfig
    : mainnetConfig),
};

export type { Token, RpcProvider };
export { DexPlatformConfig, tokenList, rpcProviders };
