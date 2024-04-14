import type { FC } from "react";

import type { PositionAccount } from "@4x.pro/services/perpetuals/lib/position-account";
import { Tabs } from "@4x.pro/ui-kit/tabs";

import { mkPositionSettingsDialogStyles } from "./styles";
import {
  AddCollateralForm,
  ManagePositionDialog,
  RemoveCollateralForm,
  StopLossForm,
  TakeProfitForm,
  useAddCollateralForm,
  useRemoveCollateralForm,
  useStopLossForm,
  useTakeProfitForm,
} from "../manage-position";

type Props = {
  open: boolean;
  onClose: () => void;
  position: PositionAccount;
};

const PositionSettingsDialog: FC<Props> = ({ position, open, onClose }) => {
  const collateralToken = position.token;
  const positionSettingsDialogStyles = mkPositionSettingsDialogStyles();
  const addCollateralForm = useAddCollateralForm();
  const removeCollateralForm = useRemoveCollateralForm(collateralToken);
  const stopLossForm = useStopLossForm(undefined);
  const takeProfitForm = useTakeProfitForm(undefined);
  return (
    <ManagePositionDialog
      title="Manage Position"
      position={position}
      open={open}
      onClose={onClose}
    >
      <Tabs
        classNames={{
          items: positionSettingsDialogStyles.tabsList,
          tab: positionSettingsDialogStyles.tab,
          panel: positionSettingsDialogStyles.content,
        }}
        items={[
          { id: "add-collateral", content: "Add collateral" },
          { id: "remove-collateral", content: "Remove collateral" },
          { id: "stop-loss", content: "Stop loss" },
          { id: "take-profit", content: "Take profit" },
        ]}
        panels={{
          "add-collateral": (
            <AddCollateralForm position={position} form={addCollateralForm} />
          ),
          "remove-collateral": (
            <RemoveCollateralForm
              position={position}
              form={removeCollateralForm}
            />
          ),
          "stop-loss": <StopLossForm position={position} form={stopLossForm} />,
          "take-profit": (
            <TakeProfitForm position={position} form={takeProfitForm} />
          ),
        }}
      />
    </ManagePositionDialog>
  );
};

export { PositionSettingsDialog };
