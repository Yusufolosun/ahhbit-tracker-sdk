// ────────────────────────────────────────────────
// Internal Helpers — AhhbitTracker SDK v2.0.0
// ────────────────────────────────────────────────
// These are NOT exported from the public API.

import type {
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
} from './types';
import { MAINNET_CONTRACT } from './constants';

// ── Contract Resolution ─────────────────────────

export function resolveContract(
  override?: Partial<ContractId>,
  defaults: ContractId = MAINNET_CONTRACT,
): ContractId {
  return {
    contractAddress: override?.contractAddress ?? defaults.contractAddress,
    contractName: override?.contractName ?? defaults.contractName,
  };
}

export function contractPrincipal(c: ContractId): string {
  return `${c.contractAddress}.${c.contractName}`;
}

// ── Clarity Value Parsers ───────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function v(obj: any, key: string): any {
  return obj?.[key]?.value ?? obj?.[key];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function num(obj: any, key: string): number {
  return Number(v(obj, key) ?? 0);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bool(obj: any, key: string): boolean {
  const raw = v(obj, key);
  return raw === true || raw === 'true';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function str(obj: any, key: string): string {
  return String(v(obj, key) ?? '');
}

// ── Habit Tracker Parsers ───────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseHabit(json: any): Habit | null {
  if (!json || json.value === null || json.value === undefined) return null;
  const raw = json.value?.value ?? json.value ?? json;
  return {
    owner: str(raw, 'owner'),
    name: str(raw, 'name'),
    stakeAmount: num(raw, 'stake-amount'),
    currentStreak: num(raw, 'current-streak'),
    lastCheckInBlock: num(raw, 'last-check-in-block'),
    createdAtBlock: num(raw, 'created-at-block'),
    isActive: bool(raw, 'is-active'),
    isCompleted: bool(raw, 'is-completed'),
    bonusWeight: num(raw, 'bonus-weight'),
    bonusClaimed: bool(raw, 'bonus-claimed'),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseUserHabits(json: any): UserHabits {
  const ids = json?.value?.['habit-ids']?.value ?? json?.['habit-ids']?.value ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { habitIds: ids.map((item: any) => Number(item.value ?? item)) };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseUserStats(json: any): UserStats {
  const raw = json?.value ?? json;
  const ids = raw?.['habit-ids']?.value ?? [];
  return {
    totalHabits: Number(raw?.['total-habits']?.value ?? raw?.['total-habits'] ?? 0),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    habitIds: ids.map((item: any) => Number(item.value ?? item)),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseForfeitStatus(json: any): ForfeitStatus {
  const raw = json?.value?.value ?? json?.value ?? json;
  return {
    habitId: num(raw, 'habit-id'),
    isActive: bool(raw, 'is-active'),
    stakeAmount: num(raw, 'stake-amount'),
    initialStake: num(raw, 'initial-stake'),
    missedWindows: num(raw, 'missed-windows'),
    unappliedMissed: num(raw, 'unapplied-missed'),
    pendingPenalty: num(raw, 'pending-penalty'),
    stakeAfterPenalty: num(raw, 'stake-after-penalty'),
    isInPenaltyZone: bool(raw, 'is-in-penalty-zone'),
    blocksUntilNextMiss: num(raw, 'blocks-until-next-miss'),
    pctStakeRemaining: num(raw, 'pct-stake-remaining'),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseReferralInfo(json: any): ReferralInfo | null {
  if (!json || json.value === null || json.value === undefined) return null;
  const raw = json?.value?.value ?? json?.value ?? json;
  if (!raw) return null;
  return {
    referrer: str(raw, 'referrer'),
    setAtBlock: num(raw, 'set-at-block'),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseReferrerStats(json: any): ReferrerStats {
  const raw = json?.value ?? json;
  return {
    successfulReferrals: Number(raw?.['successful-referrals']?.value ?? raw?.['successful-referrals'] ?? 0),
  };
}

// ── Group Parsers ───────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseGroup(json: any): Group | null {
  if (!json || json.value === null || json.value === undefined) return null;
  const raw = json?.value?.value ?? json?.value ?? json;
  if (!raw) return null;
  return {
    creator: str(raw, 'creator'),
    stakeAmount: num(raw, 'stake-amount'),
    startBlock: num(raw, 'start-block'),
    endBlock: num(raw, 'end-block'),
    memberCount: num(raw, 'member-count'),
    isActive: bool(raw, 'is-active'),
    isSettled: bool(raw, 'is-settled'),
    totalStaked: num(raw, 'total-staked'),
    successfulCount: num(raw, 'successful-count'),
    settledCount: num(raw, 'settled-count'),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseGroupMember(json: any): GroupMember | null {
  if (!json || json.value === null || json.value === undefined) return null;
  const raw = json?.value?.value ?? json?.value ?? json;
  if (!raw) return null;
  return {
    member: str(raw, 'member'),
    habitId: num(raw, 'habit-id'),
    joinedAtBlock: num(raw, 'joined-at-block'),
    streakAtJoin: num(raw, 'streak-at-join'),
    isSuccessful: bool(raw, 'is-successful'),
    hasClaimed: bool(raw, 'has-claimed'),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseMemberGroups(json: any): MemberGroups {
  const raw = json?.value ?? json;
  const ids = raw?.['group-ids']?.value ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { groupIds: ids.map((item: any) => Number(item.value ?? item)) };
}

// ── Reward Parsers ──────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseMilestoneReward(json: any): MilestoneReward | null {
  if (!json || json.value === null || json.value === undefined) return null;
  const raw = json?.value?.value ?? json?.value ?? json;
  if (!raw) return null;
  return {
    rewardAmount: Number(raw?.['reward-amount']?.value ?? raw?.['reward-amount'] ?? 0),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseClaimDetails(json: any): ClaimDetails | null {
  if (!json || json.value === null || json.value === undefined) return null;
  const raw = json?.value?.value ?? json?.value ?? json;
  if (!raw) return null;
  return {
    claimedBy: str(raw, 'claimed-by'),
    claimedAtBlock: num(raw, 'claimed-at-block'),
  };
}

// ── Generic Helpers ─────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unwrapOkNumber(json: any): number {
  if (json?.success === true) return Number(json.value?.value ?? json.value ?? 0);
  return Number(json?.value ?? 0);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unwrapOkBoolean(json: any): boolean {
  if (json?.success === true) {
    const val = json.value?.value ?? json.value;
    return val === true || val === 'true';
  }
  if (json?.type === 'bool') return Boolean(json.value);
  return Boolean(json?.value);
}
