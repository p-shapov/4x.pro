import { Dialog } from "@headlessui/react";
import cn from "classnames";
import type { ComponentProps, FC } from "react";

import { mkDialogStyles } from "@4x.pro/shared/styles/dialog";

import { Button } from "./button";
import { StatusIcon } from "./status-icon";

type Props = {
  type: "success";
  title: string;
  open: boolean;
  okText: string;
  onClose: () => void;
  onOk: () => void;
};

const MessageDialog: FC<Props & ComponentProps<typeof StatusIcon>> = ({
  type,
  title,
  open,
  okText,
  onClose,
  onOk,
}) => {
  const dialogStyles = mkDialogStyles();
  return (
    <Dialog
      as="div"
      className={dialogStyles.root}
      open={open}
      onClose={onClose}
    >
      <div className={dialogStyles.layout}>
        <Dialog.Panel className={cn(dialogStyles.panel, "max-w-[360px]")}>
          <div className={cn(dialogStyles.header, "gap-[12px]", "mb-[20px]")}>
            <StatusIcon type={type} />
            <span className={dialogStyles.title}>{title}</span>
          </div>
          <div className={dialogStyles.content}>
            <Button variant="accent" size="lg" onClick={onOk}>
              {okText}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export { MessageDialog };
