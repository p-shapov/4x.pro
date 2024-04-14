import cn from "classnames";

import { mkTabsStyles } from "@4x.pro/shared/styles/tabs";

const mkPerpetualsLayoutStyles = () => {
  const tabsStyles = mkTabsStyles({ stretchTabs: false });
  return {
    overlay: cn(
      "w-full",
      "h-100vh",
      "bg-[url('/images/app-bg.png')]",
      "bg-cover",
    ),
    root: cn(
      "relative",
      "grid",
      "gap-[4px]",
      "px-[16px]",
      "w-100%",
      "max-w-[1440px]",
      "m-auto",
      "h-[100vh]",
      "grid-rows-[max-content_1fr]",
    ),
    header: cn(
      "grid",
      "grid-flow-col",
      "justify-between",
      "justify-items-center",
      "items-center",
      "pt-[12px]",
      "pb-[16px]",
    ),
    logo: cn("absolute"),
    main: cn("h-full", "min-h-[0px]"),
    controls: cn("flex", "gap-[12px]"),
    links: cn(tabsStyles.items, "gap-[24px]"),
    link: cn(tabsStyles.tab, "after:!bottom-[calc(100%+8px)]"),
    activeLink: tabsStyles.activeTab,
    inactiveLink: tabsStyles.inactiveTab,
  };
};

export { mkPerpetualsLayoutStyles };
