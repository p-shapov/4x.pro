"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import cn from "classnames";
import { useEffect, useId, useState } from "react";
import type { ChangeEventHandler, FC } from "react";

import { getTokenSymbol } from "@4x.pro/configs/dex-platform";
import type { Token } from "@4x.pro/configs/dex-platform";
import { useTokenBalance } from "@4x.pro/shared/hooks/use-token-balance";
import { mkFieldStyles } from "@4x.pro/shared/styles/field";
import { formatCurrency } from "@4x.pro/shared/utils/number";

import { Select } from "./select";
import { TokenBadge } from "./token-badge";

type Props = {
  tokenList?: ReadonlyArray<Token>;
  label?: string;
  value?: number | "";
  defaultValue?: number | "";
  token?: Token;
  defaultToken?: Token;
  placeholder?: string;
  readonly?: boolean;
  showBalance?: boolean;
  onFocus?: () => void;
  onChange?: (data: { amount: number; token: Token }) => void;
};

const TokenField: FC<Props> = ({
  tokenList,
  token,
  defaultToken,
  onChange,
  defaultValue,
  value,
  showBalance,
  label,
  placeholder,
  ...rest
}) => {
  const fieldStyles = mkFieldStyles({ outlined: true, size: "md" });
  const { connection } = useConnection();
  const id = useId();
  const [amount, setAmount] = useState<number>(value || defaultValue || 0);
  const [currentToken, setCurrentToken] = useState(token || defaultToken);
  if (!currentToken) throw new Error("Token is required");
  const { publicKey } = useWallet();
  const tokenBalance = useTokenBalance(connection)({
    variables: {
      token: showBalance ? currentToken : undefined,
      account: publicKey?.toBase58(),
    },
  });
  const tokenListKey = tokenList?.join("");
  useEffect(() => {
    setCurrentToken(token || defaultToken);
    setAmount(value || defaultValue || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenListKey, token]);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const amount = Number(e.currentTarget.value);
    setAmount(amount);
    onChange?.({ amount, token: currentToken });
  };
  const handleSelect = (token: string) => {
    // TODO :: make Select component generic
    setCurrentToken(token as Token);
    onChange?.({ amount, token: token as Token });
  };
  return (
    <div className={fieldStyles.root}>
      {(label || showBalance) && (
        <label
          htmlFor={id}
          className={cn(fieldStyles.label, "flex", "justify-between")}
        >
          <span>{label}</span>
          {showBalance && (
            <span>
              <span className={cn("text-h6", "text-content-2")}>Balance: </span>
              <span className={cn("text-h6", "text-green")}>
                {formatCurrency(currentToken)(tokenBalance.data)}
              </span>
            </span>
          )}
        </label>
      )}
      <span className={fieldStyles.inputWrap}>
        <input
          id={id}
          type="number"
          className={cn(
            "[-moz-appearance:_textfield]",
            "[&::-webkit-outer-spin-button]:m-0",
            "[&::-webkit-outer-spin-button]:appearance-none",
            "[&::-webkit-inner-spin-button]:m-0",
            "[&::-webkit-inner-spin-button]:appearance-none",
            fieldStyles.input,
          )}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          placeholder={placeholder}
          {...rest}
        />
        {tokenList && (
          <span className={fieldStyles.postfix}>
            <Select
              size="sm"
              readonly={rest.readonly}
              options={tokenList.map((token) => ({
                value: token,
                content: <TokenBadge token={token} gap={8} />,
              }))}
              outlined={false}
              value={token}
              defaultValue={defaultToken}
              onChange={handleSelect}
              popoverPosition="right"
            />
          </span>
        )}
        {token && !tokenList && (
          <span className={fieldStyles.postfix}>{getTokenSymbol(token)}</span>
        )}
      </span>
    </div>
    // <NumberField
    //   postfix={

    //   }
    //   onChange={handleChange}
    //   value={value?.amount}
    //   defaultValue={defaultValue?.amount}
    //   {...rest}
    // />
  );
};

export { TokenField };
