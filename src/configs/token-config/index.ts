import { devnetConfig } from "./devnet";
import { mainnetConfig } from "./mainnet";
import { tokenList } from "./token-list";
import type { Token } from "./token-list";
import type { Network } from "../network-config";

type TokenConfig = {
  TradingViewSymbols: Record<Token, string>;
  PythFeedIds_to_USD: Record<Token, string>;
  TokenLogos: Partial<Record<Token, `/coins/${string}.svg`>>;
  TokenNetworks: Record<Token, Network>;
  TokenSymbols: Record<Token, string>;
};

const TradingViewSymbols: Record<Token, string> = {
  Sol_SOL: "PYTH:SOLUSD",
  Sol_USDC: "PYTH:USDCUSD",
  Sol_BTC: "PYTH:BTCUSD",
  Sol_ETH: "PYTH:ETHUSD",
};

const TokenLogos: Partial<Record<Token, `/coins/${string}.svg`>> = {
  Sol_BTC: "/coins/BTC.svg",
  Sol_ETH: "/coins/ETH.svg",
};

const TokenNetworks: Record<Token, Network> = {
  Sol_SOL: "solana",
  Sol_USDC: "solana",
  Sol_BTC: "solana",
  Sol_ETH: "solana",
};

const TokenSymbols: Record<Token, string> = {
  Sol_SOL: "SOL",
  Sol_USDC: "USDC",
  Sol_BTC: "BTC",
  Sol_ETH: "ETH",
};

const tokenConfig: TokenConfig = {
  TradingViewSymbols,
  TokenNetworks,
  TokenLogos,
  TokenSymbols,
  ...(process.env.NEXT_PUBLIC_IS_DEVNET === "true"
    ? devnetConfig
    : mainnetConfig),
};

export type { Token, TokenConfig };
export { tokenConfig, tokenList };
