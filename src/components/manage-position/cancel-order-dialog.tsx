import { Dialog } from "@headlessui/react";
import type { FC } from "react";

import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { Icon } from "@4x.pro/ui-kit/icon";

import { CancelOrderForm, useCancelOrderForm } from "./cancel-order-form";
import { ProfNLoss } from "./prof-n-loss";
import { mkManagePositionDialogStyles } from "./styles";

type Props = {
  position: PositionAccount;
  type: "stop-loss" | "take-profit";
  open: boolean;
  onClose: () => void;
};

const CancelOrderDialog: FC<Props> = ({ position, open, type, onClose }) => {
  const form = useCancelOrderForm();
  const managePositionDialogStyles = mkManagePositionDialogStyles();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={managePositionDialogStyles.root}
    >
      <div className={managePositionDialogStyles.layout}>
        <Dialog.Panel className={managePositionDialogStyles.panel}>
          <div className={managePositionDialogStyles.header}>
            <Dialog.Title className={managePositionDialogStyles.title}>
              Cancel Order
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
          <div className={managePositionDialogStyles.content}>
            <CancelOrderForm form={form} position={position} type={type} />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export { CancelOrderDialog };
