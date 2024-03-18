import type { ComponentProps, FC } from "react";

import { TradeForm } from "@4x.pro/components/trade-form";

type Props = Pick<
  ComponentProps<typeof TradeForm>,
  "form" | "baseTokenList" | "quoteToken"
>;

const TradeLongForm: FC<Props> = ({ form, baseTokenList, quoteToken }) => {
  return (
    <TradeForm
      form={form}
      title="Long/Buy"
      baseTokenList={baseTokenList}
      quoteToken={quoteToken}
    />
  );
};

export { TradeLongForm };
