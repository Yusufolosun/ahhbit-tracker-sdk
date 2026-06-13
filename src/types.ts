// ────────────────────────────────────────────────
// Types — AhhbitTracker SDK v2.0.0
// ────────────────────────────────────────────────

/** Contract deployment identifiers. */
export interface ContractId {
  contractAddress: string;
  contractName: string;
}

// ── Habit Tracker Types ─────────────────────────

/** On-chain habit data returned by `get-habit`. */
export interface Habit {
  owner: string;
  name: string;
  stakeAmount: number;
  currentStreak: number;
  lastCheckInBlock: number;
  createdAtBlock: number;
  isActive: boolean;
  isCompleted: boolean;
  bonusWeight: number;
  bonusClaimed: boolean;
}

/** User habit list returned by `get-user-habits`. */
export interface UserHabits {
  habitIds: number[];
}

/** User stats returned by `get-user-stats`. */
export interface UserStats {
  totalHabits: number;
  habitIds: number[];
}

/** Forfeit status returned by `get-forfeit-status`. */
export interface ForfeitStatus {
  habitId: number;
  isActive: boolean;
  stakeAmount: number;
  initialStake: number;
  missedWindows: number;
  unappliedMissed: number;
  pendingPenalty: number;
  stakeAfterPenalty: number;
  isInPenaltyZone: boolean;
  blocksUntilNextMiss: number;
  pctStakeRemaining: number;
}

/** Referral relationship returned by `get-referrer`. */
export interface ReferralInfo {
  referrer: string;
  setAtBlock: number;
}

/** Referrer stats returned by `get-referrer-stats`. */
export interface ReferrerStats {
  successfulReferrals: number;
}

// ── Accountability Group Types ──────────────────

/** Accountability group data returned by `get-group`. */
export interface Group {
  creator: string;
  stakeAmount: number;
  startBlock: number;
  endBlock: number;
  memberCount: number;
  isActive: boolean;
  isSettled: boolean;
  totalStaked: number;
  successfulCount: number;
  settledCount: number;
}

/** Group member data returned by `get-member-info`. */
export interface GroupMember {
  member: string;
  habitId: number;
  joinedAtBlock: number;
  streakAtJoin: number;
  isSuccessful: boolean;
  hasClaimed: boolean;
}

/** User's group list returned by `get-member-groups-list`. */
export interface MemberGroups {
  groupIds: number[];
}

// ── Streak Reward Types ─────────────────────────

/** Milestone reward tier returned by `get-milestone-reward`. */
export interface MilestoneReward {
  rewardAmount: number;
}

/** Claim details returned by `get-claim-details`. */
export interface ClaimDetails {
  claimedBy: string;
  claimedAtBlock: number;
}

// ── Utility Types ───────────────────────────────

/** Check-in window state for an active habit. */
export type CheckInWindowState =
  | 'expired'
  | 'urgent'
  | 'available'
  | 'cooldown'
  | 'just-checked-in'
  | 'unknown';
