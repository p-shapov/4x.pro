import cn from "classnames";

const mkDefinitionStyles = () => {
  return {
    root: cn(
      "inline-flex",
      "gap-[0.4rem]",
      "before:order-2",
      "before:content-['']",
      "before:block",
      "before:h-0",
      "before:flex-1",
      "before:border-[1px]",
      "before:border-dashed",
      "before:border-strong",
      "before:self-end",
      "before:mb-[0.5rem]",
    ),
    term: cn("inline-flex", "order-1", "text-body-12", "text-content-2"),
    info: cn("inline-flex", "order-3", "text-body-12", "text-content-1"),
  };
};

export { mkDefinitionStyles };
