"use client";
import { Dialog } from "@headlessui/react";
import type { FC, ReactNode } from "react";

import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { Icon } from "@4x.pro/ui-kit/icon";

import { mkManagePositionDialogStyles } from "./styles";
import { ProfNLoss } from "../prof-n-loss";

type Props = {
  title?: string;
  children: ReactNode;
  position: PositionAccount;
  open: boolean;
  onClose: () => void;
};

const ManagePositionDialog: FC<Props> = ({
  title = "Manage Position",
  position,
  open,
  onClose,
  children,
}) => {
  const managePositionDialogStyles = mkManagePositionDialogStyles();
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
              {title}
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
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export { ManagePositionDialog };
