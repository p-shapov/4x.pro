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
import { mkManagePositionStyles } from "./styles";
import { TakeProfitForm, useTakeProfitForm } from "./take-profit-form";

type Props = {
  position: PositionAccount;
  open: boolean;
  onClose: () => void;
};

const ManagePosition: FC<Props> = ({ position, open, onClose }) => {
  const collateralToken = position.token;
  const managePositionStyles = mkManagePositionStyles();
  const addCollateralForm = useAddCollateralForm();
  const removeCollateralForm = useRemoveCollateralForm(collateralToken);
  const stopLossForm = useStopLossForm(undefined);
  const takeProfitForm = useTakeProfitForm(undefined);
  return (
    <Dialog className={managePositionStyles.root} open={open} onClose={onClose}>
      <div className={managePositionStyles.layout}>
        <Dialog.Panel className={managePositionStyles.panel}>
          <div className={managePositionStyles.header}>
            <Dialog.Title className={managePositionStyles.title}>
              Manage Position
            </Dialog.Title>
            <div className={managePositionStyles.pnl}>
              <ProfNLoss position={position} />
            </div>
            <button type="button" onClick={onClose}>
              <Icon
                src="/icons/close.svg"
                className={managePositionStyles.closeBtn}
              />
            </button>
          </div>
          <Tabs
            classNames={{
              items: managePositionStyles.tabsList,
              tab: managePositionStyles.tab,
              panel: managePositionStyles.content,
            }}
            items={[
              { id: "add", content: "Add collateral" },
              { id: "remove", content: "Remove collateral" },
              { id: "sl", content: "Stop loss", disabled: true },
              { id: "tp", content: "Take profit", disabled: true },
            ]}
            panels={{
              add: (
                <AddCollateralForm
                  position={position}
                  form={addCollateralForm}
                />
              ),
              remove: (
                <RemoveCollateralForm
                  position={position}
                  form={removeCollateralForm}
                />
              ),
              sl: <StopLossForm position={position} form={stopLossForm} />,
              tp: <TakeProfitForm position={position} form={takeProfitForm} />,
            }}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export { ManagePosition };
