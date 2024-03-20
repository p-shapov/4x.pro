import type { ComponentProps, FC } from "react";

import { TradeForm } from "@4x.pro/components/trade-form";

type Props = Pick<ComponentProps<typeof TradeForm>, "form">;

const TradeShortForm: FC<Props> = ({ form }) => {
  return <TradeForm form={form} title="Short/Sell" />;
};

export { TradeShortForm };
