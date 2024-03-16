type Formatter = (value: number, fractionalDigits?: number) => string;

const formatIdentity: Formatter = (value, fractionalDigits) => {
  return value.toFixed(fractionalDigits);
};
const formatPercentage: Formatter = (value, fractionalDigits) => {
  return value.toFixed(fractionalDigits) + "%";
};
const formatRate: Formatter = (value, fractionalDigits) => {
  return value.toFixed(fractionalDigits) + "x";
};

export { formatIdentity, formatPercentage, formatRate };
export type { Formatter };
