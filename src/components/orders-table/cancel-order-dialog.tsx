import type { FC } from "react";

import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";

import { mkCancelOrderDialogStyles } from "./styles";
import {
  CancelOrderForm,
  ManagePositionDialog,
  useCancelOrderForm,
} from "../manage-position";

type Props = {
  position: PositionAccount;
  type: "stop-loss" | "take-profit";
  open: boolean;
  onClose: () => void;
};

const CancelOrderDialog: FC<Props> = ({ position, open, type, onClose }) => {
  const form = useCancelOrderForm();
  const cancelOrderDialogStyles = mkCancelOrderDialogStyles();
  return (
    <ManagePositionDialog
      title="Cancel Order"
      position={position}
      open={open}
      onClose={onClose}
    >
      <div className={cancelOrderDialogStyles.content}>
        <CancelOrderForm form={form} position={position} type={type} />
      </div>
    </ManagePositionDialog>
  );
};

export { CancelOrderDialog };
