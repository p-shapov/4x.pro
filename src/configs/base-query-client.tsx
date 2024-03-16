import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { FC, PropsWithChildren } from "react";

const baseQueryClient = new QueryClient();

const BaseQueryClientProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={baseQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

export { baseQueryClient, BaseQueryClientProvider };
