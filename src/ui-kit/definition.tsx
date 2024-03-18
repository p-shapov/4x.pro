import type { FC, ReactNode } from "react";

import { mkDefinitionStyles } from "@4x.pro/shared/styles/definition";

type Props = {
  term: string;
  content: ReactNode;
};

const definitionStyles = mkDefinitionStyles();

const Definition: FC<Props> = ({ term, content }) => {
  return (
    <div className={definitionStyles.root}>
      <dt className={definitionStyles.term}>{term}</dt>
      <dd className={definitionStyles.info}>{content}</dd>
    </div>
  );
};

export { Definition };
