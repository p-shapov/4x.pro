import type { Token } from "@4x.pro/configs/token-config";

type Formatter = (value?: number, fractionalDigits?: number) => string;

const formatIdentity: Formatter = (value, fractionalDigits) => {
  return value?.toFixed(fractionalDigits) || "-";
};
const formatPercentage: Formatter = (value, fractionalDigits) => {
  return value ? value.toFixed(fractionalDigits) + "%" : "-";
};
const formatRate: Formatter = (value, fractionalDigits) => {
  return value ? value.toFixed(fractionalDigits) + "x" : "-";
};
const formatCurrency_USD: Formatter = (value, fractionalDigits) => {
  return value ? "$" + value.toFixed(fractionalDigits) : "-";
};
const formatCurrency_BTC: Formatter = (value, fractionalDigits) => {
  return value ? value.toFixed(fractionalDigits) + " BTC" : "-";
};
const formatCurrency_ETH: Formatter = (value, fractionalDigits) => {
  return value ? value.toFixed(fractionalDigits) + " ETH" : "-";
};
const formatCurrency_SOL: Formatter = (value, fractionalDigits) => {
  return value ? value.toFixed(fractionalDigits) + " SOL" : "-";
};
const formatCurrency_USDC: Formatter = (value, fractionalDigits) => {
  return value ? value.toFixed(fractionalDigits) + " USDC" : "-";
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
  formatIdentity,
  formatPercentage,
  formatRate,
  formatCurrency_BTC,
  formatCurrency_ETH,
  formatCurrency_SOL,
  formatCurrency_USDC,
  currencyFormatters,
  calculateLiquidationPrice,
};
export type { Formatter };
