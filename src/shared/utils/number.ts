import type { Token } from "@4x.pro/app-config";

type Formatter = (
  value?: number | null,
  maximumFractionDigits?: number,
  minimumFractionDigits?: number,
) => string;

const roundToFirstNonZeroDecimal = (value: number) => {
  return Number(value.toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)?.[0] || 0);
};
const formatDefault: Formatter = (
  value,
  maximumFractionDigits = 2,
  minimumFractionDigits = maximumFractionDigits,
) => {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return new Intl.NumberFormat("en", {
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value);
};
const formatPercentage: Formatter = (
  value,
  maximumFractionDigits = 2,
  minimumFractionDigits = maximumFractionDigits,
) => {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return (
    new Intl.NumberFormat("en", {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value) + "%"
  );
};
const formatRate: Formatter = (
  value,
  maximumFractionDigits = 2,
  minimumFractionDigits = maximumFractionDigits,
) => {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return (
    new Intl.NumberFormat("en", {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value) + "x"
  );
};
const formatCurrency_USD: Formatter = (
  value,
  maximumFractionDigits = 2,
  minimumFractionDigits = maximumFractionDigits,
) => {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return (
    "$" +
    new Intl.NumberFormat("en", {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value)
  );
};
const formatCurrency_BTC: Formatter = (
  value,
  maximumFractionDigits = 2,
  minimumFractionDigits = maximumFractionDigits,
) => {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return (
    new Intl.NumberFormat("en", {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value) + " BTC"
  );
};
const formatCurrency_ETH: Formatter = (
  value,
  maximumFractionDigits = 2,
  minimumFractionDigits = maximumFractionDigits,
) => {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return (
    new Intl.NumberFormat("en", {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value) + " ETH"
  );
};
const formatCurrency_SOL: Formatter = (
  value,
  maximumFractionDigits = 2,
  minimumFractionDigits = maximumFractionDigits,
) => {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return (
    new Intl.NumberFormat("en", {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value) + " SOL"
  );
};
const formatCurrency_USDC: Formatter = (
  value,
  maximumFractionDigits = 2,
  minimumFractionDigits = maximumFractionDigits,
) => {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return (
    new Intl.NumberFormat("en", {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value) + " USDC"
  );
};
const formatCurrency_LP: Formatter = (
  value,
  maximumFractionDigits = 2,
  minimumFractionDigits = maximumFractionDigits,
) => {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return (
    new Intl.NumberFormat("en", {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value) + " LP"
  );
};
const formatCurrency = (token: Token | "$") => {
  return currencyFormatters[token];
};
const currencyFormatters: Record<Token | "$", Formatter> = {
  $: formatCurrency_USD,
  BTC: formatCurrency_BTC,
  SOL: formatCurrency_SOL,
  USDC: formatCurrency_USDC,
  LP: formatCurrency_LP,
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
  roundToFirstNonZeroDecimal,
  formatCurrency,
};
export type { Formatter };
