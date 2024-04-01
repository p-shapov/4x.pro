import cn from "classnames";

type Props = {
  isPositive: boolean;
};

const mkProfNLossStyles = ({ isPositive }: Props) => {
  return {
    root: cn(
      "flex",
      "items-center",
      "gap-x-[0.9rem]",
      "w-max",
      "p-[0.8rem]",
      "text-body-[12px]",
      "bg-opacity-[0.2]",
      "rounded-[1rem]",
      {
        [cn("text-red", "bg-red")]: !isPositive,
        [cn("text-green", "bg-green")]: isPositive,
      },
    ),
    item: cn("flex", "items-center", "gap-x-[0.4rem]"),
    icon: cn("size-[1.6rem]"),
  };
};

export { mkProfNLossStyles };
