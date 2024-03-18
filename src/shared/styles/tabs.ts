import cn from "classnames";

type Props = {
  stretchTabs?: boolean;
};

const mkTabsStyles = ({ stretchTabs }: Props) => {
  return {
    root: cn("grid", "gap-[4px]"),
    items: cn("flex", "gap-[0.4rem]", {
      flex: !stretchTabs,
      grid: stretchTabs,
      "grid-flow-col": stretchTabs,
      "grid-cols-fr": stretchTabs,
    }),
    tab: cn(
      "inline-block",
      "text-h3",
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
