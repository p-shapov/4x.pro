/* eslint-disable import/no-unused-modules */
declare global {
  import type { Address } from 'viem';
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_IS_DEVNET: 'true' | 'false';
      NEXT_PUBLIC_HELIUS_API_KEY: string;
      NEXT_PUBLIC_WC_PROJECT_ID: string;
    }
  }
}

export {};
