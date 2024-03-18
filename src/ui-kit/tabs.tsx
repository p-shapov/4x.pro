import { Tab } from "@headlessui/react";
import cn from "classnames";
import type { ReactNode } from "react";

import { mkTabsStyles } from "@promo-shock/shared/styles/tabs";
import type { PropsWithStyles } from "@promo-shock/shared/types";

type Props<T extends string> = {
  items: {
    id: T;
    content: ReactNode;
  }[];
  panels: Record<T, ReactNode>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

const Tabs = <T extends string>({
  items,
  panels,
  value,
  stretchTabs,
  defaultValue,
  onChange,
}: PropsWithStyles<Props<T>, typeof mkTabsStyles>): ReactNode => {
  const tabsStyles = mkTabsStyles({ stretchTabs });
  const defaultIndex = items.findIndex((item) => item.id === defaultValue);
  const selectedIndex = items.findIndex((item) => item.id === value);

  const handleChange = (index: number) => {
    onChange?.(items[index].id);
  };

  return (
    <div className={tabsStyles.root}>
      <Tab.Group
        selectedIndex={selectedIndex === -1 ? undefined : selectedIndex}
        defaultIndex={defaultIndex === -1 ? undefined : defaultIndex}
        onChange={handleChange}
      >
        <Tab.List className={tabsStyles.items}>
          {({ selectedIndex }) => (
            <>
              {items.map((item, idx) => (
                <Tab
                  key={item.id}
                  className={cn(tabsStyles.tab, {
                    [tabsStyles.activeTab]: selectedIndex === idx,
                    [tabsStyles.inactiveTab]: selectedIndex !== idx,
                  })}
                >
                  {item.content}
                </Tab>
              ))}
            </>
          )}
        </Tab.List>
        <Tab.Panels>
          {Object.values(panels).map((panel, idx) => (
            <Tab.Panel key={idx}>{panel as ReactNode}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export { Tabs };
