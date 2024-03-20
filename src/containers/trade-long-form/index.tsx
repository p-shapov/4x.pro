import type { ComponentProps, FC } from "react";

import { TradeForm } from "@4x.pro/components/trade-form";

type Props = Pick<ComponentProps<typeof TradeForm>, "form" | "quoteToken">;

const TradeLongForm: FC<Props> = ({ form, quoteToken }) => {
  return <TradeForm form={form} title="Long/Buy" quoteToken={quoteToken} />;
};

export { TradeLongForm };
