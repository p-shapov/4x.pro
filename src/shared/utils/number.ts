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

export { formatIdentity, formatPercentage, formatRate, formatCurrency_USD };
export type { Formatter };
