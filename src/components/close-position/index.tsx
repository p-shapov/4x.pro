import { Dialog } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWallet } from "@solana/wallet-adapter-react";
import dayjs from "dayjs";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";

import { getTokenSymbol } from "@4x.pro/app-config";
// import type { Token } from "@4x.pro/app-config";
import { useClosePosition } from "@4x.pro/services/perpetuals/hooks/use-close-position";
import { useCustodies } from "@4x.pro/services/perpetuals/hooks/use-custodies";
import { useExitPriceStats } from "@4x.pro/services/perpetuals/hooks/use-exit-price-stats";
import { useLiquidationPriceStats } from "@4x.pro/services/perpetuals/hooks/use-liquidation-price-stats";
import { usePnLStats } from "@4x.pro/services/perpetuals/hooks/use-pnl-stats";
import { usePools } from "@4x.pro/services/perpetuals/hooks/use-pools";
import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { Side } from "@4x.pro/services/perpetuals/lib/types";
import { useUpdateTradingHistory } from "@4x.pro/services/trading-history/hooks/use-update-trading-history";
import {
  formatCurrency_SOL,
  formatCurrency_USD,
  formatRate,
} from "@4x.pro/shared/utils/number";
import { Button } from "@4x.pro/ui-kit/button";
import { Definition } from "@4x.pro/ui-kit/definition";
import { Icon } from "@4x.pro/ui-kit/icon";
import { messageToast } from "@4x.pro/ui-kit/message-toast";
import { NumberField } from "@4x.pro/ui-kit/number-field";
// import { Select } from "@4x.pro/ui-kit/select";
import { TokenPrice } from "@4x.pro/ui-kit/token-price";

import type { SubmitData } from "./schema";
import { submitDataSchema } from "./schema";
import { mkClosePositionStyles } from "./styles";
import { Wallet } from "../wallet";

type Props = {
  open: boolean;
  position: PositionAccount;
  onClose: () => void;
};

// const receiveTokens: readonly Token[] = ["SOL", "USDC", "BTC", "ETH"];

const ClosePosition: FC<Props> = ({ position, open, onClose }) => {
  const form = useForm<SubmitData>({
    defaultValues: {
      receiveToken: position.token,
      slippage: 0.5,
    },
    resolver: yupResolver(submitDataSchema),
  });
  const { data: custodies } = useCustodies();
  const custody = custodies?.[position.custody.toBase58()];
  const closePositionStyles = mkClosePositionStyles();
  const collateral =
    custody && position.collateralAmount.toNumber() / 10 ** custody.decimals;
  const entryPrice = position.getPrice();
  const collateralToken = position.token;
  const leverage = position.getLeverage();
  const side = position.side === Side.Long ? "long" : "short";
  const pools = usePools();
  const closePosition = useClosePosition();
  const size = collateral && collateral * leverage;
  const walletContextState = useWallet();
  const tradingHistory = useUpdateTradingHistory();
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
        await tradingHistory.mutate({
          token: collateralToken,
          type: "close",
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
    <Dialog className={closePositionStyles.root} open={open} onClose={onClose}>
      <div className={closePositionStyles.layout}>
        <Dialog.Panel className={closePositionStyles.panel}>
          <div className={closePositionStyles.header}>
            <Dialog.Title className={closePositionStyles.title}>
              Close {side} {getTokenSymbol(collateralToken)}
            </Dialog.Title>
            <button type="button" onClick={onClose}>
              <Icon
                src="/icons/close.svg"
                className={closePositionStyles.closeBtn}
              />
            </button>
          </div>
          <form
            onSubmit={handleFormSubmit}
            className={closePositionStyles.form}
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export { ClosePosition };
