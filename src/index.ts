// ────────────────────────────────────────────────
// AhhbitTracker SDK — Public API
// ────────────────────────────────────────────────
// v2.0.0 — Supports habit-tracker-v3, habit-accountability-group-v3,
// and habit-streak-reward-v3 contracts on Stacks blockchain.

// ── Types ───────────────────────────────────────

export type {
  ContractId,
  Habit,
  UserHabits,
  UserStats,
  ForfeitStatus,
  ReferralInfo,
  ReferrerStats,
  Group,
  GroupMember,
  MemberGroups,
  MilestoneReward,
  ClaimDetails,
  CheckInWindowState,
} from './types';

// ── Constants ───────────────────────────────────

export {
  // Contract deployments
  MAINNET_CONTRACT,
  MAINNET_ACCOUNTABILITY_CONTRACT,
  MAINNET_REWARD_CONTRACT,
  TESTNET_CONTRACT,
  TESTNET_ACCOUNTABILITY_CONTRACT,
  TESTNET_REWARD_CONTRACT,
  // Habit tracker constants
  MIN_STAKE_AMOUNT,
  MAX_STAKE_AMOUNT,
  MAX_HABIT_NAME_LENGTH,
  CHECK_IN_WINDOW,
  MIN_CHECK_IN_INTERVAL,
  MIN_STREAK_FOR_WITHDRAWAL,
  FORFEIT_BPS_PER_MISS,
  BPS_DENOMINATOR,
  MIN_ACTIVE_STAKE,
  REFERRAL_BOOST_PER_COMPLETION,
  MAX_REFERRAL_BOOST,
  // Group constants
  MAX_GROUP_SIZE,
  MIN_GROUP_DURATION,
  MAX_GROUP_DURATION,
  BLOCKS_PER_DAY,
  // Reward constants
  MILESTONE_TIERS,
  MIN_FUND_AMOUNT,
  // Error codes
  ErrorCode,
  errorMessages,
} from './constants';
export type { ErrorCodeValue } from './constants';

// ── Errors ──────────────────────────────────────

export {
  AhhbitError,
  decodeContractError,
  extractClarityErrorCode,
  isAhhbitError,
} from './errors';

// ── Validation ──────────────────────────────────

export {
  assertPositiveInteger,
  assertHabitName,
  assertStakeAmount,
  assertGroupDuration,
  assertFundAmount,
  validateHabitName,
  validateStakeAmount,
  validateGroupDuration,
} from './validation';

// ── Utilities ───────────────────────────────────

export {
  toSTX,
  toMicroSTX,
  formatSTX,
  shortenAddress,
  blocksToTime,
  getCheckInWindowState,
  getBlocksRemaining,
  getBlocksUntilNextCheckIn,
  isEligibleToWithdraw,
  isEligibleForCheckIn,
  normalizeTxId,
} from './utils';

// ── Habit Tracker — Transaction Builders ────────

export {
  buildCreateHabit,
  buildCheckIn,
  buildSlashHabit,
  buildWithdrawStake,
  buildClaimBonus,
  buildRegisterReferrer,
} from './habit/builders';

// ── Habit Tracker — Read-Only Queries ───────────

export {
  getHabit,
  getUserHabits,
  getHabitStreak,
  getPoolBalance,
  getTotalHabits,
  getUserStats,
  getForfeitStatus,
  getEstimatedBonusShare,
  getUnclaimedCompletedHabits,
  getUnclaimedCompletedWeight,
  getReferrer,
  getReferrerStats,
  getReferralBoost,
  getExpiredHabits,
} from './habit/queries';

// ── Accountability Groups — Transaction Builders ─

export {
  buildCreateGroup,
  buildJoinGroup,
  buildSettleMember,
  buildClaimGroupReward,
  buildFinalizeGroup,
  buildRefundFailedGroup,
} from './groups/builders';

// ── Accountability Groups — Read-Only Queries ───

export {
  getGroup,
  getGroupShare,
  getMemberInfo,
  getMemberGroups,
  getTotalGroups,
} from './groups/queries';

// ── Streak Rewards — Transaction Builders ───────

export {
  buildFundRewardPool,
  buildClaimMilestoneReward,
} from './rewards/builders';

// ── Streak Rewards — Read-Only Queries ──────────

export {
  getMilestoneReward,
  getRewardPoolBalance,
  isMilestoneClaimed,
  getClaimDetails,
  getTotalDistributed,
} from './rewards/queries';
