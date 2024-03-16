import cn from "classnames";

const mkTabsStyles = () => {
  return {
    root: cn("grid", "gap-[4px]"),
    items: cn("flex", "gap-[0.4rem]"),
    tab: cn(
      "inline-block",
      "text-h3",
      "px-[0.4rem]",
      "border-b-[2px]",
      "transition-colors",
      "uppercase",
      "outline-none",
    ),
    activeTab: cn("text-accent", "border-accent"),
    inactiveTab: cn("text-content-1", "border-transparent"),
  };
};

export { mkTabsStyles };
