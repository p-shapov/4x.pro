import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

const OpenPositionFormContext = createContext<{
  lastTouchedPosition: "base" | "quote";
  setLastTouchedPosition: (field: "base" | "quote") => void;
} | null>(null);

const OpenPositionFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [lastTouchedPosition, setLastTouchedPosition] = useState<
    "base" | "quote"
  >("base");
  return (
    <OpenPositionFormContext.Provider
      value={{ lastTouchedPosition, setLastTouchedPosition }}
    >
      {children}
    </OpenPositionFormContext.Provider>
  );
};

const useLastTouchedPosition = () => {
  const context = useContext(OpenPositionFormContext);
  if (!context) {
    throw new Error(
      "useLastTouchedPosition must be used within a PositionProvider",
    );
  }
  return context;
};

export { OpenPositionFormProvider, useLastTouchedPosition };
