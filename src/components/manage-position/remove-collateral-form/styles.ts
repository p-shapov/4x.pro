import cn from "classnames";

const mkRemoveCollateralFormStyles = () => {
  return {
    root: cn("grid", "gap-[24px]"),
    fieldset: cn("grid", "gap-[12px]"),
    statsList: cn("grid", "auto-rows-max", "flex-1", "gap-[12px]"),
  };
};

export { mkRemoveCollateralFormStyles };
