"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWallet } from "@solana/wallet-adapter-react";
import dayjs from "dayjs";
import { useDeferredValue } from "react";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useChangeCollateral } from "@4x.pro/services/perpetuals/hooks/use-change-collateral";
import { useCustody } from "@4x.pro/services/perpetuals/hooks/use-custodies";
import { useLiquidationPriceStats } from "@4x.pro/services/perpetuals/hooks/use-liquidation-price-stats";
import { usePool } from "@4x.pro/services/perpetuals/hooks/use-pool";
import { useLogTransaction } from "@4x.pro/services/perpetuals/hooks/use-transaction-history";
import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { useTokenBalance } from "@4x.pro/shared/hooks/use-token-balance";
import {
  formatCurrency,
  formatCurrency_USD,
  formatPercentage,
  formatRate,
} from "@4x.pro/shared/utils/number";
import { Button } from "@4x.pro/ui-kit/button";
import { Comparison } from "@4x.pro/ui-kit/comparison";
import { Definition } from "@4x.pro/ui-kit/definition";
import { messageToast } from "@4x.pro/ui-kit/message-toast";
import { RangeSlider } from "@4x.pro/ui-kit/range-slider";
import { TokenField } from "@4x.pro/ui-kit/token-field";

import type { SubmitData } from "./schema";
import { submitDataSchema } from "./schema";
import { mkAddCollateralFormStyles } from "./styles";
import { Wallet } from "../../wallet";

const useAddCollateralForm = () => {
  return useForm<SubmitData>({
    defaultValues: {
      depositAmount: 0,
    },
    resolver: yupResolver(submitDataSchema),
  });
};

type Props = {
  position: PositionAccount;
  form: UseFormReturn<SubmitData>;
};

const AddCollateralForm: FC<Props> = ({ position, form }) => {
  const walletContextState = useWallet();
  const { data: custody } = useCustody({
    address: position.custody.toBase58(),
  });
  const collateral =
    custody && position.collateralAmount.toNumber() / 10 ** custody.decimals;
  const entryPrice = position.getPrice();
  const collateralToken = position.token;
  const side = position.side;
  const leverage = position.getLeverage();
  const changeCollateral = useChangeCollateral();
  const logTransaction = useLogTransaction();
  const addCollateralFormStyles = mkAddCollateralFormStyles();
  const depositAmount = useWatch({
    control: form.control,
    name: "depositAmount",
  });
  const { data: collateralBalance } = useTokenBalance({
    token: collateralToken,
    account: walletContextState.publicKey,
  });
  const { data: pool } = usePool({ address: position.pool });
  const errors = form.formState.errors;
  const size = collateral && collateral * leverage;
  const collateralAfterDeposit = collateral && collateral + depositAmount;
  const leverageAfterDeposit =
    collateralAfterDeposit && size && size / collateralAfterDeposit;
  const sizeAfterDeposit =
    collateralAfterDeposit &&
    size &&
    (collateralAfterDeposit > size ? collateralAfterDeposit : size);
  const { data: liqPrice } = useLiquidationPriceStats({
    position,
  });
  const { data: liqPriceAfterDeposit } = useLiquidationPriceStats({
    position,
    depositAmount: useDeferredValue(depositAmount),
  });
  const handleSubmit = form.handleSubmit(async (data) => {
    if (isInsufficientBalance) {
      messageToast("Insufficient balance", "error");
    } else if (leverageAfterDeposit && leverageAfterDeposit < 1) {
      messageToast("Position leverage is too low", "error");
    } else if (leverageAfterDeposit && leverageAfterDeposit > 20) {
      messageToast("Position leverage exceeds limit", "error");
    } else if (!pool) {
      messageToast("No pool found", "error");
    } else {
      try {
        messageToast("Transaction submitted", "success");
        const txid = await changeCollateral.mutateAsync({
          type: "add-collateral",
          collatNum: data.depositAmount,
          pool,
          position,
        });
        await logTransaction.mutateAsync({
          txid,
          type: "add-collateral",
          time: dayjs().utc(false).unix(),
          token: collateralToken,
          txData: {
            side,
            price: entryPrice,
            size,
            collateral: collateralAfterDeposit,
            leverage: leverageAfterDeposit,
          },
        });
      } catch (e) {
        console.error(e);
      }
    }
  });
  const mkHandleFieldChange =
    (onChange: (depositAmount: number) => void) =>
    ({ amount }: { amount: number }) => {
      onChange(amount);
    };
  const mkHandleRangeChange =
    (onChange: (percentage: number) => void) => (percentage: number) => {
      if (typeof collateralBalance === "number") {
        onChange((collateralBalance / 100) * percentage);
      }
    };
  const isInsufficientBalance = depositAmount > (collateralBalance || 0);
  return (
    <form
      onSubmit={handleSubmit}
      className={addCollateralFormStyles.root}
      noValidate
    >
      <fieldset className={addCollateralFormStyles.fieldset}>
        <Controller<SubmitData, "depositAmount">
          name="depositAmount"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <TokenField
              value={value}
              token={collateralToken}
              onChange={mkHandleFieldChange(onChange)}
              label="Deposit"
              placeholder="0.00"
              labelVariant="balance"
              error={!!errors.depositAmount}
              presets={[20, 40, 60, 80]}
              mapPreset={(value) => (collateralBalance || 0) * (value / 100)}
              formatPresets={(value) => formatPercentage(value, 0)}
              showSymbol
            />
          )}
        />
        <Controller<SubmitData, "depositAmount">
          name="depositAmount"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <RangeSlider
              value={
                collateralBalance
                  ? (value / collateralBalance) * 100
                  : undefined
              }
              step={1}
              formatValue={formatPercentage}
              onChange={mkHandleRangeChange(onChange)}
            />
          )}
        />
      </fieldset>
      <dl className={addCollateralFormStyles.statsList}>
        <Definition
          term="Size"
          content={
            <Comparison
              initial={size}
              final={sizeAfterDeposit}
              formatValue={formatCurrency(collateralToken)}
            />
          }
        />
        <Definition
          term="Collateral"
          content={
            <Comparison
              initial={collateral}
              final={collateralAfterDeposit}
              formatValue={formatCurrency(collateralToken)}
            />
          }
        />
        <Definition
          term="Leverage"
          content={
            <Comparison
              initial={leverage}
              final={leverageAfterDeposit}
              formatValue={formatRate}
            />
          }
        />
        <Definition
          term="Liq. Price"
          content={
            liqPrice && liqPriceAfterDeposit ? (
              <Comparison
                initial={liqPrice}
                final={liqPriceAfterDeposit}
                formatValue={formatCurrency_USD}
              />
            ) : (
              "-"
            )
          }
        />
      </dl>
      {!walletContextState.connected ? (
        <Wallet.Connect variant="accent" size="lg" />
      ) : (
        <Button
          type="submit"
          variant="accent"
          disabled={!pool}
          size="lg"
          loading={changeCollateral.isPending}
        >
          {depositAmount > 0 ? "Add collateral" : "Enter amount"}
        </Button>
      )}
    </form>
  );
};

export { AddCollateralForm, useAddCollateralForm };
