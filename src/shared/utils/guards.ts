import { tokenList } from "@4x.pro/app-config";
import type { Token } from "@4x.pro/app-config";

const isToken = (token: string): token is Token => {
  return tokenList.some((t) => t === token);
};

export { isToken };
