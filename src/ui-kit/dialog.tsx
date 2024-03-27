"use client";
import { Dialog as Dialog_ } from "@headlessui/react";
import cn from "classnames";
import type { FC, PropsWithChildren } from "react";

import { mkDialogStyles } from "@4x.pro/shared/styles/dialog";

import { Icon } from "./icon";

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
};

const Dialog: FC<PropsWithChildren<Props>> = ({
  title,
  open,
  onClose,
  children,
}) => {
  const dialogStyles = mkDialogStyles();
  return (
    <Dialog_
      as="div"
      className={dialogStyles.root}
      open={open}
      onClose={onClose}
    >
      <div className={dialogStyles.layout}>
        <Dialog_.Panel className={cn(dialogStyles.panel, "max-w-[360px]")}>
          <div
            className={cn(dialogStyles.header, "justify-between", "mb-[14px]")}
          >
            <Dialog_.Title className={dialogStyles.title}>
              {title}
            </Dialog_.Title>
            <button type="button" onClick={onClose}>
              <Icon className={dialogStyles.closeBtn} src="/icons/close.svg" />
            </button>
          </div>
          {children}
        </Dialog_.Panel>
      </div>
    </Dialog_>
  );
};

export { Dialog };
