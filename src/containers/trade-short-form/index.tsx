import type { ComponentProps, FC } from "react";

import { TradeForm } from "@4x.pro/components/trade-form";

type Props = Pick<ComponentProps<typeof TradeForm>, "form" | "quoteToken">;

const TradeShortForm: FC<Props> = ({ form, quoteToken }) => {
  return <TradeForm form={form} title="Short/Sell" quoteToken={quoteToken} />;
};

export { TradeShortForm };
