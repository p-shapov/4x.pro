import cn from "classnames";

import { mkTableStyles } from "@4x.pro/shared/styles/table";

const mkOrderRowStyles = () => {
  const tableStyles = mkTableStyles();
  return {
    root: cn(tableStyles.row, tableStyles.rowDelimiter),
    cell: cn(tableStyles.cell),
    secondaryText: cn("text-content-2"),
  };
};

const mkOrdersTableStyles = () => {
  const tableStyles = mkTableStyles();
  return {
    root: cn(tableStyles.root),
    row: cn(tableStyles.row),
    head: cn(tableStyles.head, "pl-[2.4rem]"),
    body: cn(tableStyles.body),
    headingCell: cn(tableStyles.headingCell),
  };
};

export { mkOrderRowStyles, mkOrdersTableStyles };
