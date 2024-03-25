import cn from "classnames";

type Props = {
  type: "success";
};

const mkStatusIconStyles = ({ type }: Props) => {
  return {
    root: cn("flex", "rounded-full", "bg-strong"),
    icon: cn("size-[4rem]", {
      "text-green": type === "success",
    }),
  };
};

export { mkStatusIconStyles };
