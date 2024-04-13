/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { useNumberFormat } from "@react-input/number-format";
import { useWallet } from "@solana/wallet-adapter-react";
import cn from "classnames";
import { useEffect, useId, useState } from "react";
import type { ChangeEventHandler, FC, ReactNode } from "react";

import { getTokenSymbol } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";
import { useTokenBalance } from "@4x.pro/shared/hooks/use-token-balance";
import { mkFieldStyles } from "@4x.pro/shared/styles/field";
import type { Formatter } from "@4x.pro/shared/utils/number";
import { formatCurrency } from "@4x.pro/shared/utils/number";

import { Presets } from "./presets";
import { Select } from "./select";
import { TokenBadge } from "./token-badge";
import { Tooltip } from "./tooltip";

type Props = {
  tokenList?: ReadonlyArray<Token>;
  label?: string;
  value?: number;
  token?: Token;
  placeholder?: string;
  presets?: number[];
  mapPreset?: (value: number) => number;
  formatPresets?: Formatter;
  readonly?: boolean;
  labelVariant?: "balance" | "max";
  showSymbol?: boolean;
  max?: number;
  error?: boolean;
  labelTooltip?: {
    message: ReactNode;
    icon?: "question";
    width?: number;
  };
  onFocus?: () => void;
  onChange?: (data: { amount: number; token: Token }) => void;
};

const TokenField: FC<Props> = ({
  token,
  tokenList,
  onChange,
  value,
  labelVariant,
  label,
  placeholder,
  showSymbol,
  presets,
  formatPresets,
  labelTooltip,
  mapPreset = (value) => value,
  max,
  error,
  ...rest
}) => {
  const inputRef = useNumberFormat({
    locales: "en",
    maximumFractionDigits: 20,
  });
  const fieldStyles = mkFieldStyles({ error, notEmpty: !!value });
  const id = useId();
  const [inputValue, setInputValue] = useState((value || "").toString());
  const [amount, setAmount] = useState<number>(value || 0);
  const [currentToken, setCurrentToken] = useState(token);
  if (!currentToken) throw new Error("Token is required");
  const { publicKey } = useWallet();
  const tokenBalance = useTokenBalance({
    token: labelVariant === "balance" ? currentToken : undefined,
    account: publicKey?.toBase58(),
  });
  const tokenListKey = tokenList?.join("");
  useEffect(() => {
    setCurrentToken(token);
    setAmount(value || 0);
    setInputValue(
      value
        ? new Intl.NumberFormat("en", {
            maximumFractionDigits: 20,
          }).format(value)
        : "",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenListKey, token]);
  useEffect(() => {
    setInputValue(
      value
        ? new Intl.NumberFormat("en", {
            maximumFractionDigits: 20,
          }).format(value)
        : "",
    );
  }, [value]);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
    if (/^(\d{1,3}(,\d{3})*|\d+)(\.\d*[1-9])?$/.test(e.target.value)) {
      const amount = Number(e.currentTarget.value.replaceAll(",", ""));
      setAmount(amount);
      onChange?.({ amount, token: currentToken });
    }
    if (e.target.value === "") {
      setAmount(0);
      onChange?.({ amount: 0, token: currentToken });
    }
  };
  const handleSelect = (token: string) => {
    // TODO :: make Select component generic
    setCurrentToken(token as Token);
    onChange?.({ amount, token: token as Token });
  };
  const handleSetPresets = (preset: number) => {
    setInputValue(
      value
        ? new Intl.NumberFormat("en", {
            maximumFractionDigits: 20,
          }).format(value)
        : "",
    );
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
          <span className="inline-flex">
            <span>{label}</span>
            {labelTooltip && (
              <span className={fieldStyles.labelTooltip}>
                <Tooltip
                  icon={labelTooltip.icon}
                  message={labelTooltip.message}
                  width={labelTooltip.width}
                />
              </span>
            )}
          </span>
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
        <span className={fieldStyles.fieldWrap}>
          <span className={fieldStyles.fakeInput}>{inputValue}</span>
          <input
            ref={inputRef}
            id={id}
            className={cn(fieldStyles.input)}
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            style={{
              minWidth: !inputValue
                ? `${placeholder?.length || 1}ch`
                : undefined,
            }}
            {...rest}
          />
          {showSymbol && (
            <span className={fieldStyles.postfix}>
              {getTokenSymbol(currentToken)}
            </span>
          )}
        </span>
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
