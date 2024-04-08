import cn from "classnames";

import { mkTableStyles } from "@4x.pro/shared/styles/table";

type Props = {
  isPositive: boolean;
};

const mkPositionRowStyles = ({ isPositive }: Props) => {
  const tableStyles = mkTableStyles();
  return {
    root: cn(tableStyles.row, tableStyles.rowDelimiter),
    cell: cn(tableStyles.cell),
    secondaryText: cn("text-content-2"),
    pnl: cn({
      "text-green": isPositive,
      "text-red": !isPositive,
    }),
    controls: cn("flex", "gap-[2rem]"),
  };
};

const mkPositionsTableStyles = () => {
  const tableStyles = mkTableStyles();
  return {
    root: cn(tableStyles.root),
    row: cn(tableStyles.row),
    head: cn(tableStyles.head, "pl-[2.4rem]"),
    body: cn(tableStyles.body),
    fallbackRow: cn(tableStyles.fallbackRow),
    headingCell: cn(tableStyles.headingCell),
  };
};

export { mkPositionRowStyles, mkPositionsTableStyles };
