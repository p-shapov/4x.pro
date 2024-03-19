import type { UseResizableProps } from "react-resizable-layout";
import { useResizable } from "react-resizable-layout";
import { useEffectOnce, useLocalStorage } from "react-use";

const useResizableLayout = (id: string, props: UseResizableProps) => {
  const [persisted, setPersisted] = useLocalStorage(
    `resizable-layout/${id}`,
    props.initial,
    {
      raw: false,
      serializer: (value: number) => value.toString(),
      deserializer: Number,
    },
  );
  const resizable = useResizable({
    ...props,
    onResizeEnd: ({ position }) => setPersisted(position),
  });
  useEffectOnce(() => {
    if (persisted) resizable.setPosition(persisted);
  });
  return resizable;
};

export { useResizableLayout };
