import cn from "classnames";
import { toast } from "react-toastify";

import { Icon } from "./icon";

const mkMessageToastStyles = ({ type }: { type: "success" | "error" }) => {
  return {
    root: cn(
      "!border-white",
      "!border-opacity-[0.03]",
      "!rounded-[12px]",
      "!bg-dialog",
      "!p-[10px]",
    ),
    message: cn("flex", "items-center", "gap-[0.8rem]"),
    body: cn("!p-[0]", "!m-[0]"),
    text: cn("text-body-14", "text-content-1"),
    iconWrap: cn("inline-flex", {
      [cn("rounded-full", "bg-content-3")]: type === "success",
    }),
    icon: cn("size-[1.6rem]", {
      [cn("text-green")]: type === "success",
      "text-red": type === "error",
    }),
  };
};
const messageToast = (message: string, type: "success" | "error") => {
  const messageToastStyles = mkMessageToastStyles({ type });
  const toastIcon = () => {
    switch (type) {
      case "success":
        return (
          <span className={messageToastStyles.iconWrap}>
            <Icon src="/icons/tick.svg" className={messageToastStyles.icon} />
          </span>
        );
      case "error":
        return (
          <span className={messageToastStyles.iconWrap}>
            <Icon
              src="/icons/close-circle.svg"
              className={messageToastStyles.icon}
            />
          </span>
        );
    }
  };
  return toast(
    <div className={messageToastStyles.message}>
      {toastIcon()}
      <span className={messageToastStyles.text}>{message}</span>
    </div>,
    {
      type,
      closeButton: false,
      icon: false,
      autoClose: 4000,
      hideProgressBar: true,
      className: messageToastStyles.root,
      bodyClassName: messageToastStyles.body,
      position: "top-right",
    },
  );
};

export { messageToast };
