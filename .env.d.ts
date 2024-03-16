/* eslint-disable import/no-unused-modules */
declare global {
  import type { Address } from 'viem';
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_IS_DEVNET: 'true' | 'false';
    }
  }
}

export {};
