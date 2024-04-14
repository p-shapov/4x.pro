import cn from "classnames";

import { mkDialogStyles } from "@4x.pro/shared/styles/dialog";
import { mkTableStyles } from "@4x.pro/shared/styles/table";

const mkPositionSettingsDialogStyles = () => {
  const dialogStyles = mkDialogStyles();
  return {
    tabsList: cn(
      "grid",
      "grid-flow-col",
      "grid-cols-fr",
      "mb-[18px]",
      "px-[20px]",
      "pb-[8px]",
      "gap-[20px]",
      "border-t-[1px]",
      "border-b-[1px]",
      "border-strong",
    ),
    tab: cn("text-h5"),
    content: dialogStyles.content,
  };
};

const mkClosePositionDialogStyles = () => {
  const dialogStyles = mkDialogStyles();
  return {
    content: dialogStyles.content,
  };
};

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

export {
  mkPositionRowStyles,
  mkPositionsTableStyles,
  mkPositionSettingsDialogStyles,
  mkClosePositionDialogStyles,
};
