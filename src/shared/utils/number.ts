import type { Token } from "@4x.pro/configs/token-config";

type Formatter = (value?: number, fractionalDigits?: number) => string;

const roundToFirstNonZeroDecimal = (value: number) => {
  return Number(value.toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)?.[0] || 0);
};
const formatDefault: Formatter = (value, fractionalDigits) => {
  if (!value) return "-";
  if (fractionalDigits) return value.toFixed(fractionalDigits);
  return value ? roundToFirstNonZeroDecimal(value).toString() : "-";
};
const formatPercentage: Formatter = (value, fractionalDigits) => {
  if (!value) return "-";
  if (fractionalDigits) return value.toFixed(fractionalDigits) + "%";
  return value ? roundToFirstNonZeroDecimal(value) + "%" : "-";
};
const formatRate: Formatter = (value, fractionalDigits) => {
  if (!value) return "-";
  if (fractionalDigits) return value.toFixed(fractionalDigits) + "x";
  return value ? roundToFirstNonZeroDecimal(value) + "x" : "-";
};
const formatCurrency_USD: Formatter = (value, fractionalDigits) => {
  if (!value) return "-";
  if (fractionalDigits) return "$ " + value.toFixed(fractionalDigits);
  return value ? "$ " + roundToFirstNonZeroDecimal(value) : "-";
};
const formatCurrency_BTC: Formatter = (value, fractionalDigits) => {
  if (!value) return "-";
  if (fractionalDigits) return value.toFixed(fractionalDigits) + " BTC";
  return value ? roundToFirstNonZeroDecimal(value) + " BTC" : "-";
};
const formatCurrency_ETH: Formatter = (value, fractionalDigits) => {
  if (!value) return "-";
  if (fractionalDigits) return value.toFixed(fractionalDigits) + " ETH";
  return value ? roundToFirstNonZeroDecimal(value) + " ETH" : "-";
};
const formatCurrency_SOL: Formatter = (value, fractionalDigits) => {
  if (!value) return "-";
  if (fractionalDigits) return value.toFixed(fractionalDigits) + " SOL";
  return value ? roundToFirstNonZeroDecimal(value) + " SOL" : "-";
};
const formatCurrency_USDC: Formatter = (value, fractionalDigits) => {
  if (!value) return "-";
  if (fractionalDigits) return value.toFixed(fractionalDigits) + " USDC";
  return value ? roundToFirstNonZeroDecimal(value) + " USDC" : "-";
};
const currencyFormatters: Record<Token | "$", Formatter> = {
  $: formatCurrency_USD,
  Sol_BTC: formatCurrency_BTC,
  Sol_ETH: formatCurrency_ETH,
  Sol_SOL: formatCurrency_SOL,
  Sol_USDC: formatCurrency_USDC,
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
};
export type { Formatter };
