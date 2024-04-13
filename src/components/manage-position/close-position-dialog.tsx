import { Dialog } from "@headlessui/react";
import type { FC } from "react";

import { getTokenSymbol } from "@4x.pro/app-config";
import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { Icon } from "@4x.pro/ui-kit/icon";

import { ClosePositionForm, useClosePositionForm } from "./close-position-form";
import { mkManagePositionDialogStyles } from "./styles";

type Props = {
  position: PositionAccount;
  open: boolean;
  onClose: () => void;
};

const ClosePositionDialog: FC<Props> = ({ position, open, onClose }) => {
  const side = position.side;
  const collateralToken = position.token;
  const managePositionDialogStyles = mkManagePositionDialogStyles();
  const closePositionForm = useClosePositionForm(position.token);
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
              Close {side} {getTokenSymbol(collateralToken)}
            </Dialog.Title>
            <button type="button" onClick={onClose}>
              <Icon
                src="/icons/close.svg"
                className={managePositionDialogStyles.closeBtn}
              />
            </button>
          </div>
          <ClosePositionForm form={closePositionForm} position={position} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export { ClosePositionDialog };
