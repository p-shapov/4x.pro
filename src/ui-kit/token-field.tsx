"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import cn from "classnames";
import { useEffect, useId, useState } from "react";
import type { ChangeEventHandler, FC } from "react";

import { getTokenSymbol } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";
import { useTokenBalance } from "@4x.pro/shared/hooks/use-token-balance";
import { mkFieldStyles } from "@4x.pro/shared/styles/field";
import type { Formatter } from "@4x.pro/shared/utils/number";
import { formatCurrency } from "@4x.pro/shared/utils/number";

import { Presets } from "./presets";
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
  presets?: number[];
  mapPreset?: (value: number) => number;
  formatPresets?: Formatter;
  readonly?: boolean;
  labelVariant?: "balance" | "max";
  showPostfix?: boolean;
  max?: number;
  error?: boolean;
  onFocus?: () => void;
  onChange?: (data: { amount: number; token: Token }) => void;
};

const TokenField: FC<Props> = ({
  token,
  tokenList,
  defaultToken,
  onChange,
  defaultValue,
  value,
  labelVariant,
  label,
  placeholder,
  showPostfix,
  presets,
  formatPresets,
  mapPreset = (value) => value,
  max,
  error,
  ...rest
}) => {
  const fieldStyles = mkFieldStyles({ error });
  const id = useId();
  const [amount, setAmount] = useState<number>(value || defaultValue || 0);
  const [currentToken, setCurrentToken] = useState(token || defaultToken);
  if (!currentToken) throw new Error("Token is required");
  const { publicKey } = useWallet();
  const tokenBalance = useTokenBalance({
    token: labelVariant === "balance" ? currentToken : undefined,
    account: publicKey?.toBase58(),
  });
  const tokenListKey = tokenList?.join("");
  useEffect(() => {
    setCurrentToken(token || defaultToken);
    setAmount(value || defaultValue || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenListKey, token]);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!/^[0.]*$/.test(e.target.value)) {
      const amount = Number(e.currentTarget.value);
      setAmount(amount);
      onChange?.({ amount, token: currentToken });
    } else {
      setAmount(e.target.value);
      onChange?.({ amount: e.target.value, token: currentToken });
    }
  };
  const handleSelect = (token: string) => {
    // TODO :: make Select component generic
    setCurrentToken(token as Token);
    onChange?.({ amount, token: token as Token });
  };
  const handleSetPresets = (preset: number) => {
    setAmount(mapPreset(preset));
    onChange?.({
      amount: mapPreset(preset),
      token: currentToken,
    });
  };
  return (
    <div className={fieldStyles.root}>
      {(label || labelVariant) && (
        <label
          htmlFor={id}
          className={cn(fieldStyles.label, "flex", "justify-between")}
        >
          <span>{label}</span>
          {labelVariant === "balance" &&
            typeof tokenBalance.data === "number" && (
              <span>
                <span className={cn("text-h6", "text-content-2")}>
                  Balance:{" "}
                </span>
                <span
                  className={cn("text-h6", {
                    "text-green": !!tokenBalance.data,
                    "text-red": !tokenBalance.data,
                  })}
                >
                  {formatCurrency(currentToken)(tokenBalance.data || 0)}
                </span>
              </span>
            )}
          {labelVariant === "max" && typeof max === "number" && (
            <span>
              <span className={cn("text-h6", "text-content-2")}>Max: </span>
              <span className={cn("text-h6", "text-content-2")}>
                {formatCurrency(currentToken)(max)}
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
          min={0}
          max={max}
          {...rest}
        />
        {showPostfix && (
          <span className={fieldStyles.postfix}>
            {getTokenSymbol(currentToken)}
          </span>
        )}
        {presets && (
          <Presets
            options={presets}
            onChange={handleSetPresets}
            formatValue={formatPresets}
          />
        )}
        {tokenList && (
          <span className={cn(fieldStyles.postfix, "justify-end")}>
            <Select
              readonly={rest.readonly}
              options={tokenList.map((token) => ({
                value: token,
                content: <TokenBadge token={token} gap={8} />,
              }))}
              value={token}
              defaultValue={defaultToken}
              onChange={handleSelect}
              popoverPosition="left"
            />
          </span>
        )}
      </span>
    </div>
  );
};

export { TokenField };
