import type { ReactNode } from "react";
import { toast } from "react-toastify";

import { Icon } from "@4x.pro/ui-kit/icon";

import { mkTxToastStyles } from "./styles";
import { TxStatus } from "./tx-status";

const mkTxToast =
  (methodName: string, txid: string, txInfo?: Record<string, ReactNode>) =>
  (txRunner: () => Promise<void>) => {
    const txToastStyles = mkTxToastStyles();
    return toast.promise(
      txRunner(),
      {
        pending: {
          render() {
            return (
              <TxStatus
                txid={txid}
                txInfo={txInfo}
                status="pending"
                methodName={methodName}
              />
            );
          },
        },
        success: {
          render() {
            return (
              <TxStatus
                status="success"
                methodName={methodName}
                txid={txid}
                txInfo={txInfo}
              />
            );
          },
        },
        error: {
          render() {
            return (
              <TxStatus
                status="error"
                methodName={methodName}
                txid={txid}
                txInfo={txInfo}
              />
            );
          },
        },
      },
      {
        toastId: txid,
        className: txToastStyles.root,
        bodyClassName: txToastStyles.body,
        progressClassName: txToastStyles.progress,
        position: "bottom-left",
        autoClose: 4000,
        icon: false,
        closeButton: (props) => (
          <button
            type="button"
            className={txToastStyles.closeButton}
            onClick={props.closeToast}
          >
            <Icon src="/icons/close.svg" className={txToastStyles.closeIcon} />
          </button>
        ),
      },
    );
  };

export { mkTxToast };
