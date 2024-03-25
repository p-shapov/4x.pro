"use client";
import { Tab } from "@headlessui/react";
import cn from "classnames";
import type { ReactNode } from "react";

import { mkTabsStyles } from "@4x.pro/shared/styles/tabs";
import type { PropsWithStyles } from "@4x.pro/shared/types";

type Props<T extends string> = {
  items: {
    id: T;
    content: ReactNode;
  }[];
  panels: Record<T, ReactNode>;
  value?: T;
  defaultValue?: T;
  classNames?: {
    items?: string;
    tab?: string;
    panels?: string;
    panel?: string;
  };
  onChange?: (value: T) => void;
};

const Tabs = <T extends string>({
  items,
  panels,
  value,
  stretchTabs,
  defaultValue,
  classNames,
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
        <Tab.List className={cn(tabsStyles.items, classNames?.items)}>
          {({ selectedIndex }) => (
            <>
              {items.map((item, idx) => (
                <Tab
                  key={item.id}
                  className={cn(tabsStyles.tab, classNames?.tab, {
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
        <Tab.Panels className={classNames?.panels}>
          {Object.values(panels).map((panel, idx) => (
            <Tab.Panel
              key={idx}
              className={cn(tabsStyles.panel, classNames?.panel)}
            >
              {panel as ReactNode}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export { Tabs };
