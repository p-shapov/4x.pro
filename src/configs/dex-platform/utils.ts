import type { RpcProvider, Token } from "./config";
import { DexPlatformConfig } from "./config";

const getTvSymbol = (token: Token) => {
  return DexPlatformConfig.tvSymbols[token];
};
const getTokenLogo = (token: Token) => {
  return DexPlatformConfig.tokenLogos[token] || "/coins/fallback.svg";
};
const getTokenSymbol = (token: Token) => {
  return DexPlatformConfig.tokenSymbols[token];
};
const getTokenPythFeedId_to_USD = (token: Token) => {
  return DexPlatformConfig.pythFeedIds_to_USD[token];
};
const getRpcEndpoint = (rpcProvider: RpcProvider) => {
  return DexPlatformConfig.rpcEndpoints[rpcProvider];
};
const getPythFeedIds_to_USD = () => {
  return Object.values(DexPlatformConfig.pythFeedIds_to_USD);
};
const getTokenPublicKey = (token: Token) => {
  return DexPlatformConfig.publicKeys[token];
};
const getTokenNetwork = (token: Token) => {
  return DexPlatformConfig.tokenNetworks[token];
};

export {
  getTvSymbol,
  getTokenLogo,
  getTokenSymbol,
  getTokenPythFeedId_to_USD,
  getPythFeedIds_to_USD,
  getRpcEndpoint,
  getTokenPublicKey,
  getTokenNetwork,
};
