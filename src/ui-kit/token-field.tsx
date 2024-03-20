"use client";
import { useState } from "react";
import type { FC } from "react";

import type { Token } from "@4x.pro/configs/token-config";

import { NumberField } from "./number-field";
import { Select } from "./select";
import { TokenBadge } from "./token-badge";

type Props = {
  tokenList: ReadonlyArray<Token>;
  label?: string;
  value?: { amount: number | ""; token: Token };
  defaultValue?: { amount: number | ""; token: Token };
  placeholder?: string;
  readonly?: boolean;
  onFocus?: () => void;
  onChange?: (data: { amount: number; token: Token }) => void;
};

const TokenField: FC<Props> = ({
  tokenList,
  onChange,
  defaultValue,
  value,
  ...rest
}) => {
  const [amount, setAmount] = useState<number>(
    value?.amount || defaultValue?.amount || 0,
  );
  const [token, setTokenAccount] = useState(
    value?.token || defaultValue?.token || tokenList[0],
  );
  const handleChange = (amount: number) => {
    setAmount(amount);
    onChange?.({ amount, token });
  };
  const handleSelect = (token: string) => {
    // TODO :: make Select component generic
    setTokenAccount(token as Token);
    onChange?.({ amount, token: token as Token });
  };
  return (
    <NumberField
      postfix={
        <Select
          size="sm"
          readonly={rest.readonly}
          options={tokenList.map((token) => ({
            value: token,
            content: <TokenBadge token={token} gap={8} />,
          }))}
          outlined={false}
          value={value?.token}
          defaultValue={defaultValue?.token}
          onChange={handleSelect}
          popoverPosition="right"
        />
      }
      onChange={handleChange}
      value={value?.amount}
      defaultValue={defaultValue?.amount}
      {...rest}
    />
  );
};

export { TokenField };
