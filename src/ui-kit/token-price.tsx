import type { FC, ReactNode } from "react";

import { useDexPlatformConfig } from "@4x.pro/configs/dex-platform";
import type { Token } from "@4x.pro/configs/dex-platform";
import {
  usePythPriceFeed,
  useWatchPythPriceFeed,
} from "@4x.pro/shared/hooks/use-pyth-price-feed";
import { formatCurrency } from "@4x.pro/shared/utils/number";

type Props = {
  token: Token;
  currency?: Token | "$";
  children?: null | number | ((price?: number) => ReactNode);
  fractionalDigits?: number;
};

const WatchTokenPrice: FC<Props> = ({
  children = 1,
  token,
  currency = "$",
  fractionalDigits,
}) => {
  const pythConnection = useDexPlatformConfig((state) => state.pythConnection);
  const { priceData } = useWatchPythPriceFeed(pythConnection)(token);
  const getPrice = (price?: number) => {
    if (!price) return formatCurrency(currency)(undefined);
    if (typeof children === "function") {
      const result = children(price);
      return result;
    }
    if (typeof children === "number") {
      return price * children;
    }
    return undefined;
  };
  const tokenPrice = getPrice(priceData?.price);
  return currency === "$" ? (
    typeof tokenPrice === "number" || typeof tokenPrice === "undefined" ? (
      formatCurrency(currency)(tokenPrice, fractionalDigits)
    ) : (
      tokenPrice
    )
  ) : (
    <WatchTokenPrice token={currency} currency="$">
      {(currencyPrice) => {
        if (!currencyPrice) return formatCurrency(currency)(undefined);
        if (typeof tokenPrice === "number")
          return formatCurrency(currency)(
            tokenPrice / currencyPrice,
            fractionalDigits,
          );
        return formatCurrency(currency)(undefined);
      }}
    </WatchTokenPrice>
  );
};
const FetchTokenPrice: FC<Props> = ({
  children = 1,
  token,
  currency = "$",
  fractionalDigits,
}) => {
  const pythHttpClient = useDexPlatformConfig((state) => state.pythHttpClient);
  const { data: priceData } = usePythPriceFeed(pythHttpClient)({
    variables: { token },
  });
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
    <FetchTokenPrice token={currency} currency="$">
      {(currencyPrice) => {
        if (!currencyPrice) return formatCurrency(token)(undefined);
        if (typeof tokenPrice === "number")
          return formatCurrency(token)(
            tokenPrice / currencyPrice,
            fractionalDigits,
          );
        return tokenPrice;
      }}
    </FetchTokenPrice>
  );
};

const TokenPrice: FC<Props & { watch?: boolean }> = ({ watch, ...rest }) => {
  if (watch) {
    return <WatchTokenPrice {...rest} />;
  }
  return <FetchTokenPrice {...rest} />;
};

export { TokenPrice };
