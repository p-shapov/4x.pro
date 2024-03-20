import { devnetConfig } from "./devnet";
import { mainnetConfig } from "./mainnet";
import { tokenList } from "./token-list";
import type { Token } from "./token-list";

type TokenConfig = {
  TradingViewSymbols: Record<Token, string>;
  PythFeedIds_to_USD: Record<Token, string>;
  TokenLogos: Partial<Record<Token, string>>;
};

const TradingViewSymbols: Record<Token, string> = {
  SOL: "PYTH:SOLUSD",
  USDC: "PYTH:USDCUSD",
  BTC: "PYTH:BTCUSD",
  ETH: "PYTH:ETHUSD",
};

const TokenLogos: Partial<Record<Token, string>> = {
  BTC: "/tokens/BTC.svg",
  ETH: "/tokens/ETH.svg",
};

const tokenConfig: TokenConfig = {
  TradingViewSymbols,
  TokenLogos,
  ...(process.env.NEXT_PUBLIC_IS_DEVNET === "true"
    ? devnetConfig
    : mainnetConfig),
};

export type { Token, TokenConfig };
export { tokenConfig, tokenList };
