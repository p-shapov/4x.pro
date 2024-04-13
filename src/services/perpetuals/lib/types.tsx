import type { BN } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";

import type { Token } from "@4x.pro/app-config";

interface Pool {
  name: string;
  custodies: PublicKey[];
  ratios: TokenRatios[];
  aumUsd: BN;
  bump: number;
  lpTokenBump: number;
  inceptionTime: BN;
}

interface TokenRatios {
  target: BN;
  min: BN;
  max: BN;
}

interface Custody {
  pool: PublicKey;
  mint: PublicKey;
  tokenAccount: PublicKey;
  decimals: number;
  isStable: boolean;
  oracle: OracleParams;
  pricing: PricingParams;
  permissions: Permissions;
  fees: Fees;
  borrowRate: BorrowRateParams;

  assets: Assets;
  collectedFees: Stats;
  volumeStats: Stats;
  tradeStats: TradeStats;
  longPositions: PositionStats;
  shortPositions: PositionStats;
  borrowRateState: BorrowRateState;

  bump: number;
  tokenAccountBump: number;
}

interface BorrowRateParams {
  baseRate: BN;
  slope1: BN;
  slope2: BN;
  optimalUtilization: BN;
}

interface BorrowRateState {
  currentRate: BN;
  cumulativeRate: BN;
  lastUpdate: BN;
}

interface PositionStats {
  openPositions: BN;
  collateralUsd: BN;
  sizeUsd: BN;
  lockedAmount: BN;
  weightedLeverage: BN;
  totalLeverage: BN;
  cumulativeInterest: BN;
  cumulativeInterestSnapshot: BN;
}

interface Assets {
  collateral: BN;
  protocolFees: BN;
  owned: BN;
  locked: BN;
}

interface Stats {
  swapUsd: BN;
  addLiquidityUsd: BN;
  removeLiquidityUsd: BN;
  openPositionUsd: BN;
  closePositionUsd: BN;
  liquidationUsd: BN;
}

interface Fees {
  mode: FeesMode;
  maxIncrease: BN;
  maxDecrease: BN;
  swap: BN;
  addLiquidity: BN;
  removeLiquidity: BN;
  openPosition: BN;
  closePosition: BN;
  liquidation: BN;
  protocolShare: BN;
}

enum FeesMode {
  Fixed,
  Linear,
}

interface OracleParams {
  oracleAccount: PublicKey;
  oracleType: OracleType;
  maxPriceError: BN;
  maxPriceAgeSec: number;
}

enum OracleType {
  None,
  Test,
  Pyth,
}

interface Permissions {
  allowSwap: boolean;
  allowAddLiquidity: boolean;
  allowRemoveLiquidity: boolean;
  allowOpenPosition: boolean;
  allowClosePosition: boolean;
  allowPnlWithdrawal: boolean;
  allowCollateralWithdrawal: boolean;
  allowSizeChange: boolean;
}

interface PricingParams {
  useEma: boolean;
  tradeSpreadLong: BN;
  tradeSpreadShort: BN;
  swapSpread: BN;
  minInitialLeverage: BN;
  maxLeverage: BN;
  maxPayoffMult: BN;
}

interface TradeStats {
  profitUsd: BN;
  lossUsd: BN;
  oiLongUsd: BN;
  oiShortUsd: BN;
}

type PositionSide = "short" | "long";

type ChangeCollateralTxType = "add-collateral" | "remove-collateral";
type OrderTxType = "stop-loss" | "take-profit";
type PositionTxType = "open-position" | "close-position" | "liquidate";
type ChangeLiquidityTxType = "add-liquidity" | "remove-liquidity";

type TransactionType =
  | OrderTxType
  | PositionTxType
  | ChangeCollateralTxType
  | ChangeLiquidityTxType;

type TransactionLogData = {
  side?: PositionSide;
  price?: number;
  fee?: number;
  pnl?: number;
  leverage?: number;
  collateral?: number;
  size?: number;
};

type TransactionLog = {
  token: Token;
  type: TransactionType;
  time: number;
  txid: string;
  txData: TransactionLogData;
};

interface AccountMeta {
  pubkey: PublicKey;
  isSigner: boolean;
  isWritable: boolean;
}

class TradeSide {
  static Long = { long: {} };
  static Short = { short: {} };
}

interface Position {
  owner: PublicKey;
  pool: PublicKey;
  custody: PublicKey;
  lockCustody: PublicKey;

  openTime: BN;
  updateTime: BN;

  side: { long?: unknown; short?: unknown };
  price: BN;
  sizeUsd: BN;
  collateralUsd: BN;
  unrealizedProfitUsd: BN;
  unrealizedLossUsd: BN;
  cumulativeInterestSnapshot: BN;
  lockedAmount: BN;
  collateralAmount: BN;

  stopLoss: BN | null;
  takeProfit: BN | null;
}

interface PriceStat {
  change24hr: number;
  currentPrice: number;
  high24hr: number;
  low24hr: number;
}

type PriceStats = Record<Token, PriceStat>;

export type {
  Pool,
  TokenRatios,
  Custody,
  BorrowRateParams,
  BorrowRateState,
  PositionStats,
  Assets,
  Stats,
  Fees,
  OracleParams,
  Permissions,
  PricingParams,
  TradeStats,
  AccountMeta,
  Position,
  PriceStat,
  PriceStats,
  PositionSide,
  ChangeCollateralTxType,
  TransactionType,
  PositionTxType,
  ChangeLiquidityTxType,
  TransactionLog,
  TransactionLogData,
  OrderTxType,
};
export { FeesMode, OracleType, TradeSide };
