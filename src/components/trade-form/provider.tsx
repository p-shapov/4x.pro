import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

const TradeFormContext = createContext<{
  lastTouchedPosition: "base" | "quote";
  setLastTouchedPosition: (field: "base" | "quote") => void;
} | null>(null);

const TradeFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [lastTouchedPosition, setLastTouchedPosition] = useState<
    "base" | "quote"
  >("base");
  return (
    <TradeFormContext.Provider
      value={{ lastTouchedPosition, setLastTouchedPosition }}
    >
      {children}
    </TradeFormContext.Provider>
  );
};

const useLastTouchedPosition = () => {
  const context = useContext(TradeFormContext);
  if (!context) {
    throw new Error(
      "useLastTouchedPosition must be used within a PositionProvider",
    );
  }
  return context;
};

export { TradeFormProvider, useLastTouchedPosition };
