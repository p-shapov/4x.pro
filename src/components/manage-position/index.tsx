"use client";
import { Dialog } from "@headlessui/react";
import type { FC } from "react";

import type { Token } from "@4x.pro/configs/dex-platform";
import { Icon } from "@4x.pro/ui-kit/icon";
import { Tabs } from "@4x.pro/ui-kit/tabs";

import { AddCollateralForm, useAddCollateralForm } from "./add-collateral-form";
import { ProfNLoss } from "./prof-n-loss";
import {
  RemoveCollateralForm,
  useRemoveCollateralForm,
} from "./remove-collateral-form";
import { StopLossForm, useStopLossForm } from "./stop-loss-form";
import { mkManagePositionStyles } from "./styles";
import { TakeProfitForm, useTakeProfitForm } from "./take-profit-form";

type Props = {
  open: boolean;
  collateral: number;
  collateralToken: Token;
  entryPrice: number;
  triggerPrice?: number;
  leverage: number;
  side: "long" | "short";
  onClose: () => void;
};

const ManagePosition: FC<Props> = ({
  collateral,
  collateralToken,
  leverage,
  open,
  onClose,
  entryPrice,
  triggerPrice,
  side,
}) => {
  const managePositionStyles = mkManagePositionStyles();
  const addCollateralForm = useAddCollateralForm(collateralToken);
  const removeCollateralForm = useRemoveCollateralForm(collateralToken);
  const stopLossForm = useStopLossForm(triggerPrice);
  const takeProfitForm = useTakeProfitForm(triggerPrice);
  return (
    <Dialog className={managePositionStyles.root} open={open} onClose={onClose}>
      <div className={managePositionStyles.layout}>
        <Dialog.Panel className={managePositionStyles.panel}>
          <div className={managePositionStyles.header}>
            <Dialog.Title className={managePositionStyles.title}>
              Manage Position
            </Dialog.Title>
            <div className={managePositionStyles.pnl}>
              <ProfNLoss
                side={side}
                size={collateral * leverage}
                collateralToken={collateralToken}
                entryPrice={entryPrice}
              />
            </div>
            <button type="button" onClick={onClose}>
              <Icon
                src="/icons/close.svg"
                className={managePositionStyles.closeBtn}
              />
            </button>
          </div>
          <div className={managePositionStyles.content}>
            <Tabs
              classNames={{
                items: managePositionStyles.tabs,
                tab: managePositionStyles.tab,
              }}
              items={[
                { id: "add", content: "Add collateral" },
                { id: "remove", content: "Remove collateral" },
                { id: "sl", content: "Stop loss" },
                { id: "tp", content: "Take profit" },
              ]}
              panels={{
                add: (
                  <AddCollateralForm
                    entryPrice={entryPrice}
                    side={side}
                    form={addCollateralForm}
                    collateral={collateral}
                    leverage={leverage}
                  />
                ),
                remove: (
                  <RemoveCollateralForm
                    form={removeCollateralForm}
                    side={side}
                    collateral={collateral}
                    leverage={leverage}
                    entryPrice={entryPrice}
                  />
                ),
                sl: (
                  <StopLossForm
                    form={stopLossForm}
                    side={side}
                    triggerPrice={triggerPrice}
                    collateral={collateral}
                    collateralToken={collateralToken}
                    leverage={leverage}
                    entryPrice={entryPrice}
                  />
                ),
                tp: (
                  <TakeProfitForm
                    form={takeProfitForm}
                    side={side}
                    triggerPrice={triggerPrice}
                    collateral={collateral}
                    collateralToken={collateralToken}
                    leverage={leverage}
                    entryPrice={entryPrice}
                  />
                ),
              }}
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export { ManagePosition };
