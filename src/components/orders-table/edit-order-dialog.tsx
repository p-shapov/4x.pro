import type { FC } from "react";

import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";

import { mkEditOrderDialogStyles } from "./styles";
import {
  TakeProfitForm,
  useTakeProfitForm,
  StopLossForm,
  useStopLossForm,
  ManagePositionDialog,
} from "../manage-position";

type Props = {
  type: "stop-loss" | "take-profit";
  open: boolean;
  position: PositionAccount;
  onClose: () => void;
};

const EditOrderDialog: FC<Props> = ({ type, onClose, open, position }) => {
  const editOrderDialogStyles = mkEditOrderDialogStyles();
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
    <ManagePositionDialog
      title="Edit Order"
      position={position}
      open={open}
      onClose={onClose}
    >
      <div className={editOrderDialogStyles.content}>{getForm()}</div>
    </ManagePositionDialog>
  );
};

export { EditOrderDialog };
