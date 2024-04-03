import { BN } from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import type { Mint } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import type { Token } from "@4x.pro/app-config";

import type { CustodyAccount } from "./custody-account";
import type { AccountMeta, Pool, TokenRatios } from "./types";
import { PERPETUALS_PROGRAM_ID } from "../utils/constants";

export class PoolAccount {
  public name: string;
  public custodies: Record<string, CustodyAccount>;
  public ratios: Record<string, TokenRatios>;
  // public tokens: Token[];
  public aumUsd: BN;
  public bump: number;
  public lpTokenBump: number;
  public inceptionTime: BN;

  // public lpDecimals: number = 8;
  public address: PublicKey;
  public lpData: Mint;

  constructor(
    pool: Pool,
    custodyData: Record<string, CustodyAccount>,
    address: PublicKey,
    lpData: Mint,
  ) {
    this.name = pool.name;
    this.aumUsd = pool.aumUsd;
    this.bump = pool.bump;
    this.lpTokenBump = pool.lpTokenBump;
    this.inceptionTime = pool.inceptionTime;

    const tempCustodies: Record<string, CustodyAccount> = {};
    pool.custodies.forEach((custody: PublicKey) => {
      tempCustodies[custody.toString()] = custodyData[custody.toString()]!;
    });

    const tempRatios: Record<string, TokenRatios> = {};
    pool.ratios.forEach((ratio: TokenRatios, index: number) => {
      tempRatios[pool.custodies[index].toString()] = ratio;
    });

    this.custodies = tempCustodies;
    this.ratios = tempRatios;

    this.address = address;
    this.lpData = lpData;
  }

  getRatioStruct(publicKey: PublicKey): TokenRatios {
    return this.ratios[publicKey.toString()]
      ? this.ratios[publicKey.toString()]
      : { target: new BN(1), min: new BN(1), max: new BN(1) };
    // find the indexin
  }

  getCustodyAccount(token: Token): CustodyAccount | null {
    return (
      Object.values(this.custodies).find(
        (custody) => custody.getToken() === token,
      ) ?? null
    );
  }

  getPoolAddress(): PublicKey {
    return findProgramAddressSync(
      [Buffer.from("pool"), Buffer.from(this.name)],
      PERPETUALS_PROGRAM_ID,
    )[0];
  }

  getLpTokenMint(): PublicKey {
    return findProgramAddressSync(
      [Buffer.from("lp_token_mint"), this.getPoolAddress().toBuffer()],
      PERPETUALS_PROGRAM_ID,
    )[0];
  }

  getTokenList(exclude?: Token[]): Token[] {
    return Object.values(this.custodies)
      .map((custody) => {
        return custody?.getToken();
      })
      .filter((token) => {
        return !exclude || !exclude.includes(token);
      });
  }

  getCustodyMetas(): AccountMeta[] {
    const custodyMetas: AccountMeta[] = [];

    Object.keys(this.custodies).forEach((custody) => {
      custodyMetas.push({
        pubkey: new PublicKey(custody),
        isSigner: false,
        isWritable: true,
      });
    });

    Object.values(this.custodies).forEach((custody) => {
      custodyMetas.push({
        pubkey: custody.oracle.oracleAccount,
        isSigner: false,
        isWritable: true,
      });
    });

    return custodyMetas;
  }
  getLiquidities(): number | null {
    return this.aumUsd.toNumber() / 10 ** 6;
  }

  getTradeVolumes(): number {
    const totalAmount = Object.values(this.custodies).reduce(
      (acc: number, tokenCustody: CustodyAccount) => {
        return (
          acc +
          Object.values(tokenCustody.volumeStats).reduce(
            (acc, val) => Number(acc) + Number(val),
          )
        );
      },
      0,
    );

    return totalAmount / 10 ** 6;
  }

  getOiLong(): number {
    const totalAmount = Object.values(this.custodies).reduce(
      (acc: number, tokenCustody: CustodyAccount) => {
        return Number(acc) + Number(tokenCustody.tradeStats.oiLongUsd);
      },
      0,
    );

    return totalAmount / 10 ** 6;
  }

  getOiShort(): number {
    const totalAmount = Object.values(this.custodies).reduce(
      (acc: number, tokenCustody: CustodyAccount) => {
        return Number(acc) + Number(tokenCustody.tradeStats.oiShortUsd);
      },
      0,
    );

    return totalAmount / 10 ** 6;
  }

  getFees(): number {
    const totalAmount = Object.values(this.custodies).reduce(
      (acc: number, tokenCustody: CustodyAccount) => {
        return (
          acc +
          Object.values(tokenCustody.collectedFees).reduce(
            (acc, val) => Number(acc) + Number(val),
          )
        );
      },
      0,
    );

    return totalAmount / 10 ** 6;
  }

  setAum(aum: BN) {
    this.aumUsd = aum;
  }
}
