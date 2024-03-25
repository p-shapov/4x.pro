import { tokenList } from "@4x.pro/configs/dex-platform";
import type { Token } from "@4x.pro/configs/dex-platform";

const isToken = (token: string): token is Token => {
  return tokenList.some((t) => t === token);
};

export { isToken };
