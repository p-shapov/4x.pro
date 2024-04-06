import type { FC, ReactNode } from "react";

import { trim } from "@4x.pro/shared/utils/string";
import { Definition } from "@4x.pro/ui-kit/definition";
import { Icon } from "@4x.pro/ui-kit/icon";

import { mkTxStatusStyles } from "./styles";
import { TRX_URL } from "../utils";

type Props = {
  status: "pending" | "success" | "error";
  methodName: string;
  txid?: string;
  txInfo?: Record<string, ReactNode>;
};

const TxStatus: FC<Props> = ({ status, methodName, txid, txInfo }) => {
  const txStatusStyles = mkTxStatusStyles({ status });
  const txStatusIcon = () => {
    switch (status) {
      case "pending":
        return (
          <span className={txStatusStyles.iconWrap}>
            <Icon className={txStatusStyles.icon} src="/icons/spinner.svg" />
          </span>
        );
      case "success":
        return (
          <span className={txStatusStyles.iconWrap}>
            <Icon className={txStatusStyles.icon} src="/icons/tick.svg" />
          </span>
        );
      case "error":
        return (
          <span className={txStatusStyles.iconWrap}>
            <Icon
              className={txStatusStyles.icon}
              src="/icons/close-circle.svg"
            />
          </span>
        );
    }
  };
  return (
    <div className={txStatusStyles.root}>
      <div className={txStatusStyles.header}>
        <span className={txStatusStyles.title}>{methodName}</span>
        {txStatusIcon()}
      </div>
      <dl className={txStatusStyles.info}>
        <Definition
          term="Transaction"
          content={
            txid ? (
              <a
                href={TRX_URL(txid)}
                className="link"
                target="_blank"
                rel="noreferrer"
              >
                {trim(txid, 6)}
              </a>
            ) : (
              "-"
            )
          }
        />
        {txInfo &&
          Object.entries(txInfo).map(([term, content], idx) => (
            <Definition key={term + idx} term={term} content={content} />
          ))}
      </dl>
    </div>
  );
};

export { TxStatus };
