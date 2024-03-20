import { tokenList } from "@4x.pro/configs/token-config";
import type { Token } from "@4x.pro/configs/token-config";

const isToken = (token: string): token is Token => {
  return tokenList.some((t) => t === token);
};

export { isToken };
