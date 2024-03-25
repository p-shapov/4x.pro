import type { FC, ReactNode } from "react";

import type { Token } from "@4x.pro/configs/dex-platform";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-price-feed";
import { formatCurrency } from "@4x.pro/shared/utils/number";

type Props = {
  token: Token;
  currency?: Token | "$";
  watch?: boolean;
  children?: null | number | ((price?: number) => ReactNode);
  fractionalDigits?: number;
};

const TokenPrice: FC<Props> = ({
  children = 1,
  token,
  currency = "$",
  fractionalDigits,
}) => {
  const { priceData } = useWatchPythPriceFeed(token);
  const getPrice = (price?: number) => {
    if (!price) return formatCurrency(currency)(undefined);
    if (typeof children === "function") {
      const result = children(price);
      if (
        typeof result === "number" ||
        typeof result === "undefined" ||
        result === null
      ) {
        return formatCurrency(currency)(result, fractionalDigits);
      }
      return result;
    }
    if (typeof children === "number") {
      return formatCurrency(currency)(price * children, fractionalDigits);
    }
    return formatCurrency(currency)(undefined);
  };
  const tokenPrice = getPrice(priceData?.price);
  return currency === "$" ? (
    tokenPrice
  ) : (
    <TokenPrice token={currency} currency="$">
      {(currencyPrice) => {
        if (!currencyPrice) return formatCurrency(token)(undefined);
        if (typeof tokenPrice === "number")
          return formatCurrency(token)(
            tokenPrice / currencyPrice,
            fractionalDigits,
          );
        return tokenPrice;
      }}
    </TokenPrice>
  );
};

export { TokenPrice };
