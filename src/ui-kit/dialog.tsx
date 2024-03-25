"use client";
import { Dialog as Dialog_ } from "@headlessui/react";
import type { FC, PropsWithChildren } from "react";

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
  return (
    <Dialog_ as="div" className="relative z-10" open={open} onClose={onClose}>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog_.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-card p-6 text-left align-middle shadow-xl transition-all">
            <Dialog_.Title>{title}</Dialog_.Title>
            {children}
          </Dialog_.Panel>
        </div>
      </div>
    </Dialog_>
  );
};

export { Dialog };
