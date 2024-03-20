import type { FC, ReactNode } from "react";

import type { Token } from "@4x.pro/configs/token-config";
import { useWatchPythPriceFeed } from "@4x.pro/shared/hooks/use-pyth-price-feed";
import { currencyFormatters } from "@4x.pro/shared/utils/number";

type Props = {
  token: Token;
  currency?: Token | "$";
  watch?: boolean;
  children?: number | ((price?: number) => ReactNode);
  fractionalDigits?: number;
};

const TokenPrice: FC<Props> = ({
  children = 1,
  token,
  currency = "$",
  fractionalDigits = 2,
}) => {
  const { priceData } = useWatchPythPriceFeed(token);

  const getPrice = (price?: number) => {
    if (!price) return currencyFormatters[currency](undefined);
    if (typeof children === "function") {
      const result = children(price);
      if (typeof result === "number")
        return currencyFormatters[currency](result, fractionalDigits);
      return result;
    }
    if (typeof children === "number")
      return currencyFormatters[currency](price * children, fractionalDigits);
    return children;
  };
  const tokenPrice = getPrice(priceData?.price);

  return currency === "$" ? (
    tokenPrice
  ) : (
    <TokenPrice token={currency} currency="$">
      {(currencyPrice) => {
        if (!currencyPrice) return currencyFormatters[currency](undefined);
        if (typeof tokenPrice === "number")
          return currencyFormatters[currency](
            tokenPrice / currencyPrice,
            fractionalDigits,
          );
        return tokenPrice;
      }}
    </TokenPrice>
  );
};

export { TokenPrice };
