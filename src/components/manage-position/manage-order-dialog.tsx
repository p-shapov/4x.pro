import { Dialog } from "@headlessui/react";
import type { FC } from "react";

import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { Icon } from "@4x.pro/ui-kit/icon";

import { ProfNLoss } from "./prof-n-loss";
import { StopLossForm, useStopLossForm } from "./stop-loss-form";
import { mkManagePositionDialogStyles } from "./styles";
import { TakeProfitForm, useTakeProfitForm } from "./take-profit-form";

type Props = {
  type: "stop-loss" | "take-profit";
  open: boolean;
  position: PositionAccount;
  onClose: () => void;
};

const ManageOrderDialog: FC<Props> = ({ type, onClose, open, position }) => {
  const managePositionDialogStyles = mkManagePositionDialogStyles();
  const stopLossForm = useStopLossForm();
  const takeProfitForm = useTakeProfitForm();
  const getForm = () => {
    switch (type) {
      case "stop-loss":
        return <StopLossForm position={position} form={stopLossForm} />;
      case "take-profit":
        return <TakeProfitForm position={position} form={takeProfitForm} />;
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Panel className={managePositionDialogStyles.panel}>
        <div className={managePositionDialogStyles.header}>
          <Dialog.Title className={managePositionDialogStyles.title}>
            Manage Order
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
        <div className={managePositionDialogStyles.content}>{getForm()}</div>
      </Dialog.Panel>
    </Dialog>
  );
};

export { ManageOrderDialog };
