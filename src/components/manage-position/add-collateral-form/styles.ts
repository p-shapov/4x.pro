import cn from "classnames";

const mkAddCollateralFormStyles = () => {
  return {
    root: cn("grid", "gap-[24px]"),
    fieldset: cn("grid", "gap-[12px]"),
    statsList: cn("grid", "flex-1", "gap-[12px]"),
  };
};

export { mkAddCollateralFormStyles };
