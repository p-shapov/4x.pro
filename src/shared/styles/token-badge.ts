import cn from "classnames";

type Dir = "up" | "down";

type Props = {
  dir?: Dir;
  bold?: boolean;
  gap?: 4 | 8;
};

const mkTokenStyles = ({ dir = "up", bold = true, gap = 4 }: Props) => {
  return {
    root: cn("inline-flex", "items-center", {
      "gap-[0.4rem]": gap === 4,
      "gap-[0.8rem]": gap === 8,
      "text-body-12": !bold,
      "text-h6": bold,
    }),
    info: cn("grid"),
    symbol: cn("text-content-1", "uppercase"),
    network: cn("text-content-2", "capitalize"),
    percentage: cn("uppercase", {
      "text-green": dir === "up",
      "text-red": dir === "down",
    }),
    tradeDir: cn("inline-flex", "items-center", {
      "text-green": dir === "up",
      "text-red": dir === "down",
    }),
    icon: cn("size-[1.6rem]"),
  };
};

export { mkTokenStyles };
