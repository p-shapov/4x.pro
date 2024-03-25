import cn from "classnames";

const mkAccountButtonStyles = () => {
  return {
    button: cn(
      "grid",
      "grid-cols-[max-content_1fr_max-content]",
      "grid-rows-[max-content_max-content]",
      "gap-x-[0.8rem]",
      "gap-y-[0.2rem]",
      "justify-items-start",
      "items-center",
      "content-center",
    ),
    walletIcon: cn("col-[1/1]", "row-start-1", "row-end-3", "size-[3.6rem]"),
    balance: cn("col-[2/2]", "row-[1/1]", "text-h6", "text-content-1"),
    address: cn("col-[2/2]", "row-[2/2]", "text-body-12", "text-content-2"),
    arrowIcon: cn("col-[3/3]", "row-start-1", "row-end-3", "size-[2rem]"),
  };
};

export { mkAccountButtonStyles };
