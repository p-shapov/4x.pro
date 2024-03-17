import cn from "classnames";

const mkTableStyles = () => {
  return {
    root: cn(
      "appearance-none",
      "grid",
      "grid-cols-[repeat(var(--tw-table-cols),max-content)]",
      "gap-x-[2.4rem]",
      "max-w-full",
      "max-h-full",
    ),
    body: cn(
      "grid",
      "grid-cols-subgrid",
      "col-[1/calc(var(--tw-table-cols)+1)]",
    ),
    head: cn(
      "grid",
      "grid-cols-subgrid",
      "col-[1/calc(var(--tw-table-cols)+1)]",
      "mb-[0.4rem]",
      "bg-strong",
      "py-[0.8rem]",
      "rounded-[2.3rem]",
    ),
    row: cn(
      "grid",
      "grid-cols-subgrid",
      "justify-items-start",
      "items-center",
      "col-[1/calc(var(--tw-table-cols)+1)]",
    ),
    rowDelimiter: cn(
      "py-[1.2rem]",
      "border-b-[1px]",
      "border-dashed",
      "border-content-3",
      "last:border-0",
      "last:pb-0",
    ),
    headingCell: cn("text-content-1", "text-h6"),
    cell: cn("text-content-1", "text-body-12"),
  };
};

export { mkTableStyles };
