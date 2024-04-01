import type { Token } from "@4x.pro/configs/dex-platform";

type Formatter = (value?: number | null, fractionalDigits?: number) => string;

const roundToFirstNonZeroDecimal = (value: number) => {
  return Number(value.toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)?.[0] || 0);
};
const formatDefault: Formatter = (value, fractionalDigits = 2) => {
  if (typeof value !== "number") return "-";
  return value.toFixed(fractionalDigits);
};
const formatPercentage: Formatter = (value, fractionalDigits = 2) => {
  if (typeof value !== "number") return "-";
  return value.toFixed(fractionalDigits) + "%";
};
const formatRate: Formatter = (value, fractionalDigits = 2) => {
  if (typeof value !== "number") return "-";
  return value.toFixed(fractionalDigits) + "x";
};
const formatCurrency_USD: Formatter = (value, fractionalDigits = 2) => {
  if (typeof value !== "number") return "-";
  return "$" + value.toFixed(fractionalDigits);
};
const formatCurrency_BTC: Formatter = (value, fractionalDigits = 2) => {
  if (typeof value !== "number") return "-";
  return value.toFixed(fractionalDigits) + " BTC";
};
const formatCurrency_ETH: Formatter = (value, fractionalDigits = 2) => {
  if (typeof value !== "number") return "-";
  return value.toFixed(fractionalDigits) + " ETH";
};
const formatCurrency_SOL: Formatter = (value, fractionalDigits = 2) => {
  if (typeof value !== "number") return "-";
  return value.toFixed(fractionalDigits) + " SOL";
};
const formatCurrency_USDC: Formatter = (value, fractionalDigits = 2) => {
  if (typeof value !== "number") return "-";
  return value.toFixed(fractionalDigits) + " USDC";
};
const formatCurrency = (token: Token | "$") => {
  return currencyFormatters[token];
};
const currencyFormatters: Record<Token | "$", Formatter> = {
  $: formatCurrency_USD,
  BTC: formatCurrency_BTC,
  ETH: formatCurrency_ETH,
  SOL: formatCurrency_SOL,
  USDC: formatCurrency_USDC,
};
const calculateLiquidationPrice = (
  entryPrice: number,
  leverage: number,
  margin: number,
  isLong: boolean,
) => {
  if (isLong) {
    return entryPrice * (1 - margin / leverage);
  }
  return entryPrice * (1 + margin / leverage);
};
const calculatePnL = (
  entryPrice: number,
  exitPrice: number,
  size: number,
  isLong: boolean,
) => {
  if (isLong) {
    return size * (exitPrice - entryPrice);
  }
  return size * (entryPrice - exitPrice);
};
const calculatePnLPercentage = (
  entryPrice: number,
  exitPrice: number,
  size: number,
  isLong: boolean,
) => {
  return (
    calculatePnL(entryPrice, exitPrice, size, isLong) / (entryPrice * size)
  );
};

export {
  formatDefault,
  formatPercentage,
  formatRate,
  formatCurrency_USD,
  formatCurrency_BTC,
  formatCurrency_ETH,
  formatCurrency_SOL,
  formatCurrency_USDC,
  currencyFormatters,
  calculateLiquidationPrice,
  roundToFirstNonZeroDecimal,
  formatCurrency,
  calculatePnL,
  calculatePnLPercentage,
};
export type { Formatter };
