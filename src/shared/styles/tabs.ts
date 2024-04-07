import cn from "classnames";

type Props = {
  stretchTabs?: boolean;
};

const mkTabsStyles = ({ stretchTabs }: Props) => {
  return {
    root: cn("grid", "h-full", "grid-rows-[max-content_1fr]"),
    items: cn("flex", {
      flex: !stretchTabs,
      grid: stretchTabs,
      "grid-flow-col": stretchTabs,
      "grid-cols-fr": stretchTabs,
    }),
    tab: cn(
      "relative",
      "inline-grid",
      "justify-items-center",
      "text-h3",
      "transition-colors",
      "uppercase",
      "outline-none",
      "transition-colors",
      "pt-[10px]",
      "after:absolute",
      "after:content-['']",
      "after:z-10",
      "after:block",
      "after:w-full",
      "after:bottom-[calc(100%-4px)]",
      "after:border-t-[4px]",
      "after:transition-colors",
      "after:rounded-bl-[4px]",
      "after:rounded-br-[4px]",
    ),
    panel: cn("pt-[4px]"),
    activeTab: cn("after:border-accent", "text-accent"),
    inactiveTab: cn("after:border-transparent", "hover:text-content-2"),
    disabledTab: cn(
      "after:border-transparent",
      "text-content-3",
      "cursor-not-allowed",
    ),
  };
};

export { mkTabsStyles };
