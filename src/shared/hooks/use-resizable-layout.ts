import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect } from "react";
import type { UseResizableProps } from "react-resizable-layout";
import { useResizable } from "react-resizable-layout";

const useResizableLayout = (id: string, props: UseResizableProps) => {
  const [persisted, setPersisted] = useLocalStorage(
    `resizable-layout/${id}`,
    props.initial,
  );
  const resizable = useResizable({
    ...props,
    onResizeEnd: ({ position }) => setPersisted(position),
  });
  useEffect(() => {
    if (persisted) resizable.setPosition(persisted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return resizable;
};

export { useResizableLayout };
