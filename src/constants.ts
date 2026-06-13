// ────────────────────────────────────────────────
// Constants — AhhbitTracker SDK v2.0.0
// ────────────────────────────────────────────────

import type { ContractId } from './types';

// ── Contract Deployments ────────────────────────

/** Mainnet habit-tracker-v3 contract deployment. */
export const MAINNET_CONTRACT: ContractId = {
  contractAddress: 'SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z',
  contractName: 'habit-tracker-v3',
};

/** Mainnet accountability group contract deployment. */
export const MAINNET_ACCOUNTABILITY_CONTRACT: ContractId = {
  contractAddress: 'SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z',
  contractName: 'habit-accountability-group-v3',
};

/** Mainnet streak reward contract deployment. */
export const MAINNET_REWARD_CONTRACT: ContractId = {
  contractAddress: 'SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z',
  contractName: 'habit-streak-reward-v3',
};

/** Testnet habit-tracker-v3 contract deployment. */
export const TESTNET_CONTRACT: ContractId = {
  contractAddress: 'ST1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK1GA0CF0',
  contractName: 'habit-tracker-v3',
};

/** Testnet accountability group contract deployment. */
export const TESTNET_ACCOUNTABILITY_CONTRACT: ContractId = {
  contractAddress: 'ST1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK1GA0CF0',
  contractName: 'habit-accountability-group-v3',
};

/** Testnet streak reward contract deployment. */
export const TESTNET_REWARD_CONTRACT: ContractId = {
  contractAddress: 'ST1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK1GA0CF0',
  contractName: 'habit-streak-reward-v3',
};

// ── Habit Tracker Constants ─────────────────────

/** Minimum stake in microSTX (0.02 STX). */
export const MIN_STAKE_AMOUNT = 20_000;

/** Maximum stake in microSTX (100 STX). */
export const MAX_STAKE_AMOUNT = 100_000_000;

/** Maximum habit name length (UTF-8 characters). */
export const MAX_HABIT_NAME_LENGTH = 50;

/** Check-in window in blocks (~192 blocks = ~32 hours at 10 min/block). */
export const CHECK_IN_WINDOW = 192;

/** Minimum interval between check-ins in blocks (~96 blocks = ~16 hours). */
export const MIN_CHECK_IN_INTERVAL = 96;

/** Minimum streak required for withdrawal. */
export const MIN_STREAK_FOR_WITHDRAWAL = 7;

/** Partial forfeit rate per missed check-in (basis points). 1000 = 10%. */
export const FORFEIT_BPS_PER_MISS = 1000;

/** Basis points denominator for forfeit calculation. */
export const BPS_DENOMINATOR = 10_000;

/** Minimum remaining stake to keep a habit active (dust threshold). */
export const MIN_ACTIVE_STAKE = 1000;

/** Referral boost per successful completion. */
export const REFERRAL_BOOST_PER_COMPLETION = 1;

/** Maximum referral boost cap. */
export const MAX_REFERRAL_BOOST = 10;

// ── Accountability Group Constants ──────────────

/** Maximum group size. */
export const MAX_GROUP_SIZE = 10;

/** Minimum group duration in blocks (~1 day). */
export const MIN_GROUP_DURATION = 144;

/** Maximum group duration in blocks (~90 days). */
export const MAX_GROUP_DURATION = 12_960;

/** Blocks per 24-hour day (~144 blocks at 10 min/block). */
export const BLOCKS_PER_DAY = 144;

// ── Streak Reward Constants ─────────────────────

/** Supported milestone tiers (in days / check-ins). */
export const MILESTONE_TIERS = [7, 14, 30, 60, 90] as const;

/** Minimum funding amount in microSTX (0.01 STX). */
export const MIN_FUND_AMOUNT = 10_000;

// ── Error Codes ─────────────────────────────────

/** Contract error codes mapped by name. */
export const ErrorCode = {
  // habit-tracker-v3 errors (100 range)
  NOT_AUTHORIZED: 100,
  INVALID_STAKE_AMOUNT: 101,
  INVALID_HABIT_NAME: 102,
  HABIT_NOT_FOUND: 103,
  NOT_HABIT_OWNER: 104,
  ALREADY_CHECKED_IN: 105,
  INSUFFICIENT_STREAK: 107,
  HABIT_ALREADY_COMPLETED: 108,
  POOL_INSUFFICIENT_BALANCE: 109,
  BONUS_ALREADY_CLAIMED: 111,
  HABIT_LIMIT_REACHED: 112,
  STAKE_TOO_HIGH: 113,
  REFERRER_ALREADY_SET: 115,
  INVALID_REFERRER: 116,
  SELF_REFERRAL: 117,

  // habit-streak-reward-v3 errors (200 range)
  REWARD_NOT_AUTHORIZED: 200,
  INVALID_MILESTONE: 201,
  MILESTONE_ALREADY_CLAIMED: 202,
  REWARD_INSUFFICIENT_STREAK: 203,
  REWARD_INSUFFICIENT_FUNDS: 204,
  REWARD_HABIT_NOT_FOUND: 206,
  REWARD_NOT_HABIT_OWNER: 207,
  REWARD_INVALID_AMOUNT: 208,
  REWARD_NOT_SET: 209,

  // habit-accountability-group-v3 errors (300 range)
  GROUP_NOT_AUTHORIZED: 300,
  GROUP_NOT_FOUND: 301,
  GROUP_FULL: 302,
  ALREADY_GROUP_MEMBER: 303,
  NOT_GROUP_MEMBER: 304,
  GROUP_NOT_ACTIVE: 305,
  GROUP_STILL_ACTIVE: 306,
  GROUP_INVALID_STAKE: 307,
  GROUP_INVALID_DURATION: 308,
  GROUP_ALREADY_SETTLED: 309,
  GROUP_ALREADY_CLAIMED: 310,
  GROUP_NOT_ELIGIBLE: 311,
  GROUP_INVALID_HABIT: 312,
  GROUP_LIMIT_REACHED: 313,
} as const;

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

/** Maps error code to human-readable message. */
export const errorMessages: Record<ErrorCodeValue, string> = {
  // Habit tracker
  [ErrorCode.NOT_AUTHORIZED]: 'Not authorized',
  [ErrorCode.INVALID_STAKE_AMOUNT]: 'Stake must be between 0.02 and 100 STX',
  [ErrorCode.INVALID_HABIT_NAME]: 'Habit name must be 1-50 characters',
  [ErrorCode.HABIT_NOT_FOUND]: 'Habit not found',
  [ErrorCode.NOT_HABIT_OWNER]: 'Only the habit owner can perform this action',
  [ErrorCode.ALREADY_CHECKED_IN]: 'Already checked in within minimum interval',
  [ErrorCode.INSUFFICIENT_STREAK]: 'Need a 7-day streak to withdraw',
  [ErrorCode.HABIT_ALREADY_COMPLETED]: 'Habit is no longer active',
  [ErrorCode.POOL_INSUFFICIENT_BALANCE]: 'Pool has insufficient balance',
  [ErrorCode.BONUS_ALREADY_CLAIMED]: 'Bonus already claimed for this habit',
  [ErrorCode.HABIT_LIMIT_REACHED]: 'Maximum number of habits reached',
  [ErrorCode.STAKE_TOO_HIGH]: 'Stake amount exceeds the maximum allowed (100 STX)',
  [ErrorCode.REFERRER_ALREADY_SET]: 'Referrer already set for this account',
  [ErrorCode.INVALID_REFERRER]: 'Invalid referrer address',
  [ErrorCode.SELF_REFERRAL]: 'Cannot refer yourself',

  // Streak rewards
  [ErrorCode.REWARD_NOT_AUTHORIZED]: 'Not authorized for reward operations',
  [ErrorCode.INVALID_MILESTONE]: 'Invalid milestone tier',
  [ErrorCode.MILESTONE_ALREADY_CLAIMED]: 'Milestone already claimed for this habit',
  [ErrorCode.REWARD_INSUFFICIENT_STREAK]: 'Streak does not meet milestone requirement',
  [ErrorCode.REWARD_INSUFFICIENT_FUNDS]: 'Insufficient funds in reward pool',
  [ErrorCode.REWARD_HABIT_NOT_FOUND]: 'Habit not found',
  [ErrorCode.REWARD_NOT_HABIT_OWNER]: 'Only the habit owner can claim rewards',
  [ErrorCode.REWARD_INVALID_AMOUNT]: 'Invalid funding amount',
  [ErrorCode.REWARD_NOT_SET]: 'Reward not configured for this milestone',

  // Accountability groups
  [ErrorCode.GROUP_NOT_AUTHORIZED]: 'Not authorized for this group',
  [ErrorCode.GROUP_NOT_FOUND]: 'Group not found',
  [ErrorCode.GROUP_FULL]: 'Group is full (max 10 members)',
  [ErrorCode.ALREADY_GROUP_MEMBER]: 'Already a member of this group',
  [ErrorCode.NOT_GROUP_MEMBER]: 'Not a member of this group',
  [ErrorCode.GROUP_NOT_ACTIVE]: 'Group is no longer active',
  [ErrorCode.GROUP_STILL_ACTIVE]: 'Group period has not ended yet',
  [ErrorCode.GROUP_INVALID_STAKE]: 'Stake amount too low',
  [ErrorCode.GROUP_INVALID_DURATION]: 'Invalid group duration',
  [ErrorCode.GROUP_ALREADY_SETTLED]: 'Group already settled',
  [ErrorCode.GROUP_ALREADY_CLAIMED]: 'Reward already claimed',
  [ErrorCode.GROUP_NOT_ELIGIBLE]: 'Not eligible for reward',
  [ErrorCode.GROUP_INVALID_HABIT]: 'Invalid or inactive habit',
  [ErrorCode.GROUP_LIMIT_REACHED]: 'Group membership limit reached (max 20)',
};
