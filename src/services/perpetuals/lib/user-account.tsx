import type { Token } from "@4x.pro/app-config";

export class UserAccount {
  public lpBalances: Record<string, number>;
  public tokenBalances: Record<Token, number>;

  constructor(
    lpBalances: Record<string, number> = {},
    tokenBalances: Record<string, number> = {},
  ) {
    this.lpBalances = lpBalances;
    this.tokenBalances = tokenBalances;
  }

  getUserLpBalance(poolAddress: string): number {
    return this.lpBalances[poolAddress] || 0;
  }
}
