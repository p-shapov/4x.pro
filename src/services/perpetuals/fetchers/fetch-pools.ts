import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { getMint } from "@solana/spl-token";
import type { PublicKey } from "@solana/web3.js";

import type { CustodyAccount } from "../lib/custody-account";
import { PoolAccount } from "../lib/pool-account";
import type { Pool } from "../lib/types";
import { getPerpetualProgramAndProvider } from "../utils/constants";
import { ViewHelper } from "../utils/view-helpers";

interface FetchPool {
  account: Pool;
  publicKey: PublicKey;
}

const getPoolData = async (
  rpcEndpoint: string,
  poolPublicKey: PublicKey,
  custodyInfos: Record<string, CustodyAccount>,
) => {
  const { perpetual_program, provider } =
    await getPerpetualProgramAndProvider(rpcEndpoint);
  const pool = await perpetual_program.account.pool.fetch(poolPublicKey);
  const lpTokenMint = findProgramAddressSync(
    [Buffer.from("lp_token_mint"), poolPublicKey.toBuffer()],
    perpetual_program.programId,
  )[0];
  const lpData = await getMint(provider.connection, lpTokenMint);
  const View = new ViewHelper(provider.connection, provider);
  const poolData: Pool = {
    name: pool.name,
    custodies: pool.custodies,
    ratios: pool.ratios,
    aumUsd: pool.aumUsd,
    bump: pool.bump,
    lpTokenBump: pool.lpTokenBump,
    inceptionTime: pool.inceptionTime,
  };
  const poolObj = new PoolAccount(
    poolData,
    custodyInfos,
    poolPublicKey,
    lpData,
  );
  let fetchedAum;
  let loopStatus = true;
  while (loopStatus) {
    try {
      fetchedAum = await View.getAssetsUnderManagement(poolObj);
      loopStatus = false;
    } catch (error) {}
  }
  if (fetchedAum) {
    poolObj.setAum(fetchedAum);
  }
  return poolObj;
};

const getPoolsData = async (
  rpcEndpoint: string,
  custodyInfos: Record<string, CustodyAccount>,
) => {
  const { perpetual_program, provider } =
    await getPerpetualProgramAndProvider(rpcEndpoint);
  let fetchedPools: FetchPool[];
  try {
    fetchedPools = await perpetual_program.account.pool.all();
  } catch (error) {
    fetchedPools = [];
  }
  const poolObjs: Record<string, PoolAccount> = {};
  await Promise.all(
    Object.values(fetchedPools)
      .sort((a, b) => a.account.name.localeCompare(b.account.name))
      .map(async (pool: FetchPool) => {
        const lpTokenMint = findProgramAddressSync(
          [Buffer.from("lp_token_mint"), pool.publicKey.toBuffer()],
          perpetual_program.programId,
        )[0];
        const lpData = await getMint(provider.connection, lpTokenMint);
        const View = new ViewHelper(provider.connection, provider);
        const poolData: Pool = {
          name: pool.account.name,
          custodies: pool.account.custodies,
          ratios: pool.account.ratios,
          aumUsd: pool.account.aumUsd,
          bump: pool.account.bump,
          lpTokenBump: pool.account.lpTokenBump,
          inceptionTime: pool.account.inceptionTime,
        };
        poolObjs[pool.publicKey.toString()] = new PoolAccount(
          poolData,
          custodyInfos,
          pool.publicKey,
          lpData,
        );
        let fetchedAum;
        let loopStatus = true;
        while (loopStatus) {
          try {
            fetchedAum = await View.getAssetsUnderManagement(
              poolObjs[pool.publicKey.toString()],
            );
            loopStatus = false;
          } catch (error) {}
        }
        if (fetchedAum) {
          poolObjs[pool.publicKey.toString()].setAum(fetchedAum);
        }
      }),
  );

  return poolObjs;
};

export { getPoolsData, getPoolData };
