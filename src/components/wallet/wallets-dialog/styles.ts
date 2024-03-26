import cn from "classnames";

import { mkDialogStyles } from "@4x.pro/shared/styles/dialog";

const mkWalletButtonStyles = () => {
  const dialogStyles = mkDialogStyles();
  return {
    root: cn(
      dialogStyles.content,
      "flex",
      "w-full",
      "h-full",
      "gap-[12px]",
      "bg-transparent",
      "hover:bg-body",
      "transition-colors",
    ),
    label: cn(
      "flex-1",
      "flex",
      "h-full",
      "py-[1.6rem]",
      "items-center",
      "justify-between",
      "text-content-1",
      "border-strong",
      "border-b-[1px]",
      "group-hover/wallet-button:border-transparent",
      "group-last/wallet-button:border-none",
    ),
    text: cn("text-h5"),
    walletIcon: cn("size-[3.6rem]", "self-center"),
    arrowIcon: cn("size-[2rem]"),
  };
};

const mkWalletsDialogStyles = () => {
  return {
    root: cn("grid"),
    item: cn("group/wallet-button", "mt-[-1px]"),
  };
};

export { mkWalletButtonStyles, mkWalletsDialogStyles };
