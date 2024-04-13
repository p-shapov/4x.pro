import { yupResolver } from "@hookform/resolvers/yup";
import { useWallet } from "@solana/wallet-adapter-react";
import dayjs from "dayjs";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";

import type { Token } from "@4x.pro/app-config";
// import type { Token } from "@4x.pro/app-config";
import { useClosePosition } from "@4x.pro/services/perpetuals/hooks/use-close-position";
import { useCustodies } from "@4x.pro/services/perpetuals/hooks/use-custodies";
import { useExitPriceStats } from "@4x.pro/services/perpetuals/hooks/use-exit-price-stats";
import { useLiquidationPriceStats } from "@4x.pro/services/perpetuals/hooks/use-liquidation-price-stats";
import { usePnLStats } from "@4x.pro/services/perpetuals/hooks/use-pnl-stats";
import { usePools } from "@4x.pro/services/perpetuals/hooks/use-pools";
import { useLogTransaction } from "@4x.pro/services/perpetuals/hooks/use-transaction-history";
import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import {
  formatCurrency_SOL,
  formatCurrency_USD,
  formatRate,
} from "@4x.pro/shared/utils/number";
import { Button } from "@4x.pro/ui-kit/button";
import { Definition } from "@4x.pro/ui-kit/definition";
import { messageToast } from "@4x.pro/ui-kit/message-toast";
import { NumberField } from "@4x.pro/ui-kit/number-field";
// import { Select } from "@4x.pro/ui-kit/select";
import { TokenPrice } from "@4x.pro/ui-kit/token-price";

import type { SubmitData } from "./schema";
import { submitDataSchema } from "./schema";
import { mkClosePositionStyles } from "./styles";
import { Wallet } from "../../wallet";

type Props = {
  form: UseFormReturn<SubmitData>;
  position: PositionAccount;
};

// const receiveTokens: readonly Token[] = ["SOL", "USDC", "BTC", "ETH"];

const useClosePositionForm = (receiveToken: Token) => {
  return useForm<SubmitData>({
    defaultValues: {
      receiveToken,
      slippage: 0.5,
    },
    resolver: yupResolver(submitDataSchema),
  });
};

const ClosePositionForm: FC<Props> = ({ position, form }) => {
  const { data: custodies } = useCustodies();
  const custody = custodies?.[position.custody.toBase58()];
  const closePositionStyles = mkClosePositionStyles();
  const collateral =
    custody && position.collateralAmount.toNumber() / 10 ** custody.decimals;
  const entryPrice = position.getPrice();
  const collateralToken = position.token;
  const leverage = position.getLeverage();
  const pools = usePools();
  const closePosition = useClosePosition();
  const size = collateral && collateral * leverage;
  const side = position.side;
  const walletContextState = useWallet();
  const logTransaction = useLogTransaction();
  const { data: pnl } = usePnLStats({ position });
  const { data: liquidationPrice } = useLiquidationPriceStats({ position });
  const { data: priceStats } = useExitPriceStats({ position });
  // const mkHandleSelectChange =
  //   (onChange: (receiveToken: Token) => void) => (token: string) => {
  //     onChange(token as Token);
  //   };
  const handleFormSubmit = form.handleSubmit(async (data) => {
    const pool = Object.values(pools.data || {})[0];
    if (!pool) {
      messageToast("No pool found", "error");
    } else if (!custody) {
      messageToast("No custody found", "error");
    } else if (!priceStats?.exitPrice) {
      messageToast("Price data is not available", "error");
    } else {
      try {
        messageToast("Transaction submitted", "success");
        const txid = await closePosition.mutateAsync({
          pool,
          position,
          custody,
          price: priceStats?.exitPrice,
          slippage: data.slippage,
        });
        await logTransaction.mutate({
          token: collateralToken,
          type: "close-position",
          txid,
          time: dayjs().utc(false).unix(),
          txData: {
            side,
            price: priceStats?.exitPrice,
            pnl,
            collateral,
            size,
            fee: priceStats?.fee,
          },
        });
      } catch (e) {
        console.error(e);
      }
    }
  });
  return (
    <form
      onSubmit={handleFormSubmit}
      className={closePositionStyles.root}
      noValidate
    >
      <div className={closePositionStyles.stats}>
        <dl className={closePositionStyles.stats}>
          <Definition
            term="Allow Slippage"
            content={
              <Controller<SubmitData, "slippage">
                name="slippage"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <NumberField
                    value={value}
                    placeholder="0.00"
                    unit="%"
                    onChange={onChange}
                  />
                )}
              />
            }
          />
          {/* <Definition
                  term="Receive"
                  content={
                    <Controller<SubmitData, "receiveToken">
                      name="receiveToken"
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          inline
                          options={receiveTokens.map((token) => ({
                            value: token,
                            content: (
                              <>
                                <TokenPrice
                                  token={collateralToken}
                                  currency={token}
                                  watch
                                >
                                  {size}
                                </TokenPrice>{" "}
                                (
                                <TokenPrice token={collateralToken} watch>
                                  {size}
                                </TokenPrice>
                                )
                              </>
                            ),
                          }))}
                          popoverPosition="right"
                          value={value}
                          onChange={mkHandleSelectChange(onChange)}
                        />
                      )}
                    />
                  }
                /> */}
        </dl>
        <div className={closePositionStyles.separator} />
        <dl className={closePositionStyles.stats}>
          <Definition
            term="Market Price"
            content={formatCurrency_USD(priceStats?.exitPrice)}
          />
          <Definition
            term="Entry Price"
            content={formatCurrency_USD(entryPrice)}
          />
          <Definition
            term="Liq. price"
            content={formatCurrency_USD(liquidationPrice)}
          />
        </dl>
        <div className={closePositionStyles.separator} />
        <dl className={closePositionStyles.stats}>
          <Definition term="Size" content={formatCurrency_USD(size)} />
          <Definition
            term="Collateral (USD)"
            content={
              <TokenPrice token={collateralToken} watch>
                {collateral}
              </TokenPrice>
            }
          />
          <Definition term="Leverage" content={formatRate(leverage)} />
          <Definition
            term="Settled PnL"
            content={
              pnl &&
              (pnl > 0 ? "+" : pnl < 0 ? "-" : "") +
                formatCurrency_USD(Math.abs(pnl))
            }
          />
          <Definition
            term="Fees"
            content={formatCurrency_SOL(priceStats?.fee)}
          />
        </dl>
      </div>
      {walletContextState.connected ? (
        <Button
          type="submit"
          variant="accent"
          size="lg"
          loading={closePosition.isPending}
        >
          Close Position
        </Button>
      ) : (
        <Wallet.Connect variant="accent" size="lg" />
      )}
    </form>
  );
};

export { ClosePositionForm, useClosePositionForm };
