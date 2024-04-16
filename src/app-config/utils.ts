import type { Coin, RpcProvider, Token } from "./config";
import { DexPlatformConfig } from "./config";

const getPythTickerSymbol = (coin: Coin) => {
  return DexPlatformConfig.pythTickerSymbols[coin];
};
const getTickerSymbol = (coin: Coin) => {
  return DexPlatformConfig.tickerSymbols[coin];
};
const getTokenLogo = (token: Token) => {
  return DexPlatformConfig.tokenLogos[token] || "/coins/fallback.svg";
};
const getTokenSymbol = (token: Token) => {
  return DexPlatformConfig.tokenSymbols[token];
};
const getTokenPythFeedId_to_USD = (coin: Coin) => {
  return DexPlatformConfig.pythFeedIds_to_USD[coin];
};
const getRpcEndpoint = (rpcProvider: RpcProvider) => {
  return DexPlatformConfig.rpcEndpoints[rpcProvider];
};
const getPythFeedIds_to_USD = () => {
  return Object.values(DexPlatformConfig.pythFeedIds_to_USD);
};
const getTokenPublicKey = (token: Coin) => {
  return DexPlatformConfig.publicKeys[token];
};
const getTokenNetwork = (token: Token) => {
  return DexPlatformConfig.tokenNetworks[token];
};
const tokenAddressToToken = (tokenAddress: string) => {
  return (Object.keys(DexPlatformConfig.publicKeys) as readonly Coin[]).find(
    (token) => DexPlatformConfig.publicKeys[token] === tokenAddress,
  );
};
const getTokenId = (token: Token) => {
  return DexPlatformConfig.tokenIds[token];
};

export {
  getTickerSymbol,
  getTokenLogo,
  getTokenSymbol,
  getTokenPythFeedId_to_USD,
  getPythFeedIds_to_USD,
  getRpcEndpoint,
  getTokenPublicKey,
  getTokenNetwork,
  tokenAddressToToken,
  getTokenId,
  getPythTickerSymbol,
};
