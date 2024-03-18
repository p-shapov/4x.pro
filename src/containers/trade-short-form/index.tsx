import type { ComponentProps, FC } from "react";

import { TradeForm } from "@promo-shock/components/trade-form";

type Props = Pick<
  ComponentProps<typeof TradeForm>,
  "form" | "baseTokenList" | "quoteToken"
>;

const TradeShortForm: FC<Props> = ({ form, baseTokenList, quoteToken }) => {
  return (
    <TradeForm
      form={form}
      title="Short/Sell"
      baseTokenList={baseTokenList}
      quoteToken={quoteToken}
    />
  );
};

export { TradeShortForm };
