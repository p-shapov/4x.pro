/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Placement } from "@floating-ui/react";
import { offset, arrow, useFloating, FloatingArrow } from "@floating-ui/react";
import { Popover } from "@headlessui/react";
import { useRef } from "react";
import type { FC, ReactNode } from "react";

import { mkTooltipStyles } from "@4x.pro/shared/styles/tooltip";

import { Icon } from "./icon";

type Props = {
  children?: ReactNode;
  icon?: "question";
  width?: number;
  message: ReactNode;
  placement?: Placement;
};

const Tooltip: FC<Props> = ({
  children,
  icon = "question",
  width = 200,
  message,
  placement = "bottom-end",
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const { refs, floatingStyles, context } = useFloating({
    placement,
    middleware: [
      offset({ mainAxis: 10, crossAxis: 40 }),
      arrow({
        element: arrowRef,
      }),
    ],
    strategy: "fixed",
  });
  const tooltipStyles = mkTooltipStyles();
  const getIconSrc = (): `/icons/${string}.svg` => {
    switch (icon) {
      case "question":
        return "/icons/message-question.svg";
    }
  };
  const handleHover = () => {
    buttonRef.current?.click();
  };
  return (
    <Popover className={tooltipStyles.root}>
      <Popover.Button
        ref={(ref) => {
          buttonRef.current = ref;
          refs.setReference(ref);
        }}
        className={tooltipStyles.button}
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
      >
        {!children && icon && (
          <Icon src={getIconSrc()} className={tooltipStyles.icon} />
        )}
        {children}
      </Popover.Button>
      <Popover.Panel
        ref={refs.setFloating}
        style={{ ...floatingStyles, width, zIndex: 9999 }}
      >
        <div className={tooltipStyles.message}>{message}</div>
        <FloatingArrow
          ref={arrowRef}
          context={context}
          className={tooltipStyles.arrow}
          fill="currentColor"
        />
      </Popover.Panel>
    </Popover>
  );
};

export { Tooltip };
