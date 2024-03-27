import type { Token } from "@4x.pro/configs/dex-platform";

type Formatter = (value?: number | null, fractionalDigits?: number) => string;

const roundToFirstNonZeroDecimal = (value: number) => {
  return Number(value.toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)?.[0] || 0);
};
const formatDefault: Formatter = (value, fractionalDigits) => {
  if (typeof value !== "number") return "-";
  if (fractionalDigits) return value.toFixed(fractionalDigits);
  return roundToFirstNonZeroDecimal(value).toString();
};
const formatPercentage: Formatter = (value, fractionalDigits) => {
  if (typeof value !== "number") return "-";
  if (fractionalDigits) return value.toFixed(fractionalDigits) + "%";
  return roundToFirstNonZeroDecimal(value) + "%";
};
const formatRate: Formatter = (value, fractionalDigits) => {
  if (typeof value !== "number") return "-";
  if (fractionalDigits) return value.toFixed(fractionalDigits) + "x";
  return roundToFirstNonZeroDecimal(value) + "x";
};
const formatCurrency_USD: Formatter = (value, fractionalDigits) => {
  if (typeof value !== "number") return "-";
  if (fractionalDigits) return "$ " + value.toFixed(fractionalDigits);
  return "$ " + roundToFirstNonZeroDecimal(value);
};
const formatCurrency_BTC: Formatter = (value, fractionalDigits) => {
  if (typeof value !== "number") return "-";
  if (fractionalDigits) return value.toFixed(fractionalDigits) + " BTC";
  return roundToFirstNonZeroDecimal(value) + " BTC";
};
const formatCurrency_ETH: Formatter = (value, fractionalDigits) => {
  if (typeof value !== "number") return "-";
  if (fractionalDigits) return value.toFixed(fractionalDigits) + " ETH";
  return roundToFirstNonZeroDecimal(value) + " ETH";
};
const formatCurrency_SOL: Formatter = (value, fractionalDigits) => {
  if (typeof value !== "number") return "-";
  if (fractionalDigits) return value.toFixed(fractionalDigits) + " SOL";
  return roundToFirstNonZeroDecimal(value) + " SOL";
};
const formatCurrency_USDC: Formatter = (value, fractionalDigits) => {
  if (typeof value !== "number") return "-";
  if (fractionalDigits) return value.toFixed(fractionalDigits) + " USDC";
  return roundToFirstNonZeroDecimal(value) + " USDC";
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

export {
  formatDefault,
  formatPercentage,
  formatRate,
  formatCurrency_BTC,
  formatCurrency_ETH,
  formatCurrency_SOL,
  formatCurrency_USDC,
  currencyFormatters,
  calculateLiquidationPrice,
  roundToFirstNonZeroDecimal,
  formatCurrency,
};
export type { Formatter };
