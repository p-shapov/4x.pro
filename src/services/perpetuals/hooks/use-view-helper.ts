import { useMemo } from "react";

import { useAppConfig } from "@4x.pro/app-config";

import { getPerpetualProgramAndProvider } from "../utils/constants";
import { ViewHelper } from "../utils/view-helpers";

const useViewHelper = () => {
  const { rpcEndpoint } = useAppConfig();
  return useMemo(() => {
    const { provider } = getPerpetualProgramAndProvider(rpcEndpoint);
    return new ViewHelper(provider.connection, provider);
  }, [rpcEndpoint]);
};

export { useViewHelper };
