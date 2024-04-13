"use client";
import { Dialog } from "@headlessui/react";
import type { FC } from "react";

import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { Icon } from "@4x.pro/ui-kit/icon";
import { Tabs } from "@4x.pro/ui-kit/tabs";

import { AddCollateralForm, useAddCollateralForm } from "./add-collateral-form";
import { ProfNLoss } from "./prof-n-loss";
import {
  RemoveCollateralForm,
  useRemoveCollateralForm,
} from "./remove-collateral-form";
import { StopLossForm, useStopLossForm } from "./stop-loss-form";
import { mkManagePositionDialogStyles } from "./styles";
import { TakeProfitForm, useTakeProfitForm } from "./take-profit-form";

type Props = {
  position: PositionAccount;
  open: boolean;
  onClose: () => void;
};

const ManagePositionDialog: FC<Props> = ({ position, open, onClose }) => {
  const collateralToken = position.token;
  const managePositionDialogStyles = mkManagePositionDialogStyles();
  const addCollateralForm = useAddCollateralForm();
  const removeCollateralForm = useRemoveCollateralForm(collateralToken);
  const stopLossForm = useStopLossForm(undefined);
  const takeProfitForm = useTakeProfitForm(undefined);
  return (
    <Dialog
      className={managePositionDialogStyles.root}
      open={open}
      onClose={onClose}
    >
      <div className={managePositionDialogStyles.layout}>
        <Dialog.Panel className={managePositionDialogStyles.panel}>
          <div className={managePositionDialogStyles.header}>
            <Dialog.Title className={managePositionDialogStyles.title}>
              Manage Position
            </Dialog.Title>
            <div className={managePositionDialogStyles.pnl}>
              <ProfNLoss position={position} />
            </div>
            <button type="button" onClick={onClose}>
              <Icon
                src="/icons/close.svg"
                className={managePositionDialogStyles.closeBtn}
              />
            </button>
          </div>
          <Tabs
            classNames={{
              items: managePositionDialogStyles.tabsList,
              tab: managePositionDialogStyles.tab,
              panel: managePositionDialogStyles.content,
            }}
            items={[
              { id: "add-collateral", content: "Add collateral" },
              { id: "remove-collateral", content: "Remove collateral" },
              { id: "stop-loss", content: "Stop loss" },
              { id: "take-profit", content: "Take profit" },
            ]}
            panels={{
              "add-collateral": (
                <AddCollateralForm
                  position={position}
                  form={addCollateralForm}
                />
              ),
              "remove-collateral": (
                <RemoveCollateralForm
                  position={position}
                  form={removeCollateralForm}
                />
              ),
              "stop-loss": (
                <StopLossForm position={position} form={stopLossForm} />
              ),
              "take-profit": (
                <TakeProfitForm position={position} form={takeProfitForm} />
              ),
            }}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export { ManagePositionDialog };
