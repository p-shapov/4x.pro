import cn from "classnames";

import { mkDialogStyles } from "@4x.pro/shared/styles/dialog";
import { mkTableStyles } from "@4x.pro/shared/styles/table";

const mkEditOrderDialogStyles = () => {
  const dialogStyles = mkDialogStyles();
  return {
    content: dialogStyles.content,
  };
};

const mkCancelOrderDialogStyles = () => {
  const dialogStyles = mkDialogStyles();
  return {
    content: dialogStyles.content,
  };
};

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
    fallbackRow: cn(tableStyles.fallbackRow),
    headingCell: cn(tableStyles.headingCell),
  };
};

export {
  mkOrderRowStyles,
  mkOrdersTableStyles,
  mkEditOrderDialogStyles,
  mkCancelOrderDialogStyles,
};
