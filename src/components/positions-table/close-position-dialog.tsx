import type { FC } from "react";

import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";

import { mkClosePositionDialogStyles } from "./styles";
import {
  ClosePositionForm,
  useClosePositionForm,
  ManagePositionDialog,
} from "../manage-position";

type Props = {
  position: PositionAccount;
  open: boolean;
  onClose: () => void;
};

const ClosePositionDialog: FC<Props> = ({ position, open, onClose }) => {
  const closePositionDialogStyles = mkClosePositionDialogStyles();
  const closePositionForm = useClosePositionForm(position.token);
  return (
    <ManagePositionDialog
      title="Close Position"
      position={position}
      open={open}
      onClose={onClose}
    >
      <div className={closePositionDialogStyles.content}>
        <ClosePositionForm form={closePositionForm} position={position} />
      </div>
    </ManagePositionDialog>
  );
};

export { ClosePositionDialog };
