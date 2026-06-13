// ────────────────────────────────────────────────
// Habit Read-Only Queries — AhhbitTracker SDK
// ────────────────────────────────────────────────

import {
  uintCV,
  principalCV,
  fetchCallReadOnlyFunction,
  cvToJSON,
} from '@stacks/transactions';
import type {
  ContractId,
  Habit,
  UserHabits,
  UserStats,
  ForfeitStatus,
  ReferralInfo,
  ReferrerStats,
} from '../types';
import { MAINNET_CONTRACT } from '../constants';
import {
  resolveContract,
  parseHabit,
  parseUserHabits,
  parseUserStats,
  parseForfeitStatus,
  parseReferralInfo,
  parseReferrerStats,
  unwrapOkNumber,
} from '../helpers';

type Network = Parameters<typeof fetchCallReadOnlyFunction>[0]['network'];

// ── Core Queries ────────────────────────────────

/**
 * Fetch a habit by ID. Returns `null` if not found.
 */
export async function getHabit(
  habitId: number,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<Habit | null> {
  const c = resolveContract(contract, MAINNET_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-habit',
    functionArgs: [uintCV(habitId)],
    network,
    senderAddress: c.contractAddress,
  });
  return parseHabit(cvToJSON(cv));
}

/**
 * Fetch all habit IDs belonging to a user.
 */
export async function getUserHabits(
  userAddress: string,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<UserHabits> {
  const c = resolveContract(contract, MAINNET_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-user-habits',
    functionArgs: [principalCV(userAddress)],
    network,
    senderAddress: c.contractAddress,
  });
  return parseUserHabits(cvToJSON(cv));
}

/**
 * Fetch the current streak for a habit.
 */
export async function getHabitStreak(
  habitId: number,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<number> {
  const c = resolveContract(contract, MAINNET_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-habit-streak',
    functionArgs: [uintCV(habitId)],
    network,
    senderAddress: c.contractAddress,
  });
  return unwrapOkNumber(cvToJSON(cv));
}

/**
 * Fetch the current forfeited pool balance in microSTX.
 */
export async function getPoolBalance(
  network: Network,
  contract?: Partial<ContractId>,
): Promise<number> {
  const c = resolveContract(contract, MAINNET_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-pool-balance',
    functionArgs: [],
    network,
    senderAddress: c.contractAddress,
  });
  return unwrapOkNumber(cvToJSON(cv));
}

/**
 * Fetch the total number of habits created.
 */
export async function getTotalHabits(
  network: Network,
  contract?: Partial<ContractId>,
): Promise<number> {
  const c = resolveContract(contract, MAINNET_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-total-habits',
    functionArgs: [],
    network,
    senderAddress: c.contractAddress,
  });
  return unwrapOkNumber(cvToJSON(cv));
}

/**
 * Fetch aggregated stats for a user.
 */
export async function getUserStats(
  userAddress: string,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<UserStats> {
  const c = resolveContract(contract, MAINNET_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-user-stats',
    functionArgs: [principalCV(userAddress)],
    network,
    senderAddress: c.contractAddress,
  });
  const json = cvToJSON(cv);
  return parseUserStats(json?.value ?? json);
}

// ── V3 New Queries ──────────────────────────────

/**
 * Fetch the forfeit status for a habit, including pending penalties.
 */
export async function getForfeitStatus(
  habitId: number,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<ForfeitStatus> {
  const c = resolveContract(contract, MAINNET_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-forfeit-status',
    functionArgs: [uintCV(habitId)],
    network,
    senderAddress: c.contractAddress,
  });
  return parseForfeitStatus(cvToJSON(cv));
}

/**
 * Fetch the estimated bonus share for the next claimant.
 */
export async function getEstimatedBonusShare(
  network: Network,
  contract?: Partial<ContractId>,
): Promise<number> {
  const c = resolveContract(contract, MAINNET_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-estimated-bonus-share',
    functionArgs: [],
    network,
    senderAddress: c.contractAddress,
  });
  return unwrapOkNumber(cvToJSON(cv));
}

/**
 * Fetch the number of completed habits that haven't claimed their bonus yet.
 */
export async function getUnclaimedCompletedHabits(
  network: Network,
  contract?: Partial<ContractId>,
): Promise<number> {
  const c = resolveContract(contract, MAINNET_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-unclaimed-completed-habits',
    functionArgs: [],
    network,
    senderAddress: c.contractAddress,
  });
  return unwrapOkNumber(cvToJSON(cv));
}

/**
 * Fetch the total unclaimed bonus weight.
 */
export async function getUnclaimedCompletedWeight(
  network: Network,
  contract?: Partial<ContractId>,
): Promise<number> {
  const c = resolveContract(contract, MAINNET_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-unclaimed-completed-weight',
    functionArgs: [],
    network,
    senderAddress: c.contractAddress,
  });
  return unwrapOkNumber(cvToJSON(cv));
}

/**
 * Fetch the referrer for a user. Returns `null` if no referrer is set.
 */
export async function getReferrer(
  userAddress: string,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<ReferralInfo | null> {
  const c = resolveContract(contract, MAINNET_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-referrer',
    functionArgs: [principalCV(userAddress)],
    network,
    senderAddress: c.contractAddress,
  });
  return parseReferralInfo(cvToJSON(cv));
}

/**
 * Fetch referrer stats (number of successful referrals).
 */
export async function getReferrerStats(
  referrerAddress: string,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<ReferrerStats> {
  const c = resolveContract(contract, MAINNET_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-referrer-stats',
    functionArgs: [principalCV(referrerAddress)],
    network,
    senderAddress: c.contractAddress,
  });
  return parseReferrerStats(cvToJSON(cv));
}

/**
 * Fetch the current referral boost for a user.
 */
export async function getReferralBoost(
  userAddress: string,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<number> {
  const c = resolveContract(contract, MAINNET_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-referral-boost',
    functionArgs: [principalCV(userAddress)],
    network,
    senderAddress: c.contractAddress,
  });
  return unwrapOkNumber(cvToJSON(cv));
}

/**
 * Fetch expired habit IDs for a user.
 * Returns a list where non-expired habits appear as 0 (filter client-side).
 */
export async function getExpiredHabits(
  userAddress: string,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<number[]> {
  const c = resolveContract(contract, MAINNET_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-expired-habits',
    functionArgs: [principalCV(userAddress)],
    network,
    senderAddress: c.contractAddress,
  });
  const json = cvToJSON(cv);
  const list = json?.value?.value ?? json?.value ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const all: number[] = list.map((item: any) => Number(item.value ?? item));
  // Filter out zeros (non-expired habits)
  return all.filter((id: number) => id > 0);
}
