import cn from "classnames";

type Props = {
  status: "pending" | "success" | "error";
};

const mkTxToastStyles = () => {
  return {
    root: cn(
      "relative",
      "!border-white",
      "!border-opacity-[0.03]",
      "!rounded-[12px]",
      "!bg-dialog",
      "!p-[10px]",
    ),
    body: cn("!p-[0]", "!w-[320px]"),
    progress: cn(),
    closeButton: cn(
      "absolute",
      "top-[10px]",
      "right-[10px]",
      "inline-flex",
      "transition-colors",
      "text-content-1",
      "hover:text-content-2",
    ),
    closeIcon: cn("size-[1.6rem]"),
  };
};

const mkTxStatusStyles = ({ status }: Props) => {
  return {
    root: cn("grid", "gap-[1.2rem]"),
    header: cn("flex", "items-center", "gap-[1.2rem]"),
    title: cn("text-h6", "font-bold", "text-black"),
    info: cn("grid", "gap-[0.6rem]", "pb-[0.6rem]"),
    iconWrap: cn("inline-flex", {
      [cn("rounded-full", "bg-content-3")]: status === "success",
    }),
    icon: cn("size-[1.6rem]", {
      [cn("text-primary", "animate-spin")]: status === "pending",
      [cn("text-green")]: status === "success",
      "text-red": status === "error",
    }),
  };
};

export { mkTxStatusStyles, mkTxToastStyles };
