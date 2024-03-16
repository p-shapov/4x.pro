"use client";
import { useState } from "react";
import type { FC } from "react";

import { NumberField } from "./number-field";
import { Select } from "./select";
import { Token } from "./token";

type Props = {
  tokenList: { account: string; symbol: string; uri: string }[];
  label?: string;
  value?: number;
  defaultValue?: number;
  placeholder?: string;
  readonly?: boolean;
  onChange?: (value: number, tokenAccount: string) => void;
};

const TokenField: FC<Props> = ({ tokenList, onChange, ...rest }) => {
  const defaultTokenAccount = tokenList[0].account;
  const [value, setValue] = useState<number>(
    rest.value || rest.defaultValue || 0,
  );
  const [tokenAccount, setTokenAccount] = useState<string>(defaultTokenAccount);
  const handleChange = (value: number) => {
    setValue(value);
    onChange?.(value, tokenAccount);
  };
  const handleSelect = (id: string) => {
    setTokenAccount(id);
    onChange?.(value, id);
  };
  return (
    <NumberField
      postfix={
        <Select
          size="sm"
          readonly={rest.readonly}
          options={tokenList.map(({ account, ...rest }) => ({
            value: account,
            content: <Token {...rest} gap={8} />,
          }))}
          outlined={false}
          defaultValue={defaultTokenAccount}
          onChange={handleSelect}
          popoverPosition="right"
        />
      }
      onChange={handleChange}
      {...rest}
    />
  );
};

export { TokenField };
