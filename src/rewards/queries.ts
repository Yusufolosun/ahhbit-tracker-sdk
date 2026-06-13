// ────────────────────────────────────────────────
// Streak Reward Read-Only Queries
// ────────────────────────────────────────────────

import {
  uintCV,
  fetchCallReadOnlyFunction,
  cvToJSON,
} from '@stacks/transactions';
import type { ContractId, MilestoneReward, ClaimDetails } from '../types';
import { MAINNET_REWARD_CONTRACT } from '../constants';
import {
  resolveContract,
  parseMilestoneReward,
  parseClaimDetails,
  unwrapOkNumber,
  unwrapOkBoolean,
} from '../helpers';

type Network = Parameters<typeof fetchCallReadOnlyFunction>[0]['network'];

/**
 * Fetch the reward amount for a milestone tier.
 * Returns `null` if no reward is configured for the tier.
 */
export async function getMilestoneReward(
  milestone: number,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<MilestoneReward | null> {
  const c = resolveContract(contract, MAINNET_REWARD_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-milestone-reward',
    functionArgs: [uintCV(milestone)],
    network,
    senderAddress: c.contractAddress,
  });
  return parseMilestoneReward(cvToJSON(cv));
}

/**
 * Fetch the current reward pool balance in microSTX.
 */
export async function getRewardPoolBalance(
  network: Network,
  contract?: Partial<ContractId>,
): Promise<number> {
  const c = resolveContract(contract, MAINNET_REWARD_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-reward-pool-balance',
    functionArgs: [],
    network,
    senderAddress: c.contractAddress,
  });
  return unwrapOkNumber(cvToJSON(cv));
}

/**
 * Check if a milestone has been claimed for a habit.
 */
export async function isMilestoneClaimed(
  habitId: number,
  milestone: number,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<boolean> {
  const c = resolveContract(contract, MAINNET_REWARD_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'is-milestone-claimed',
    functionArgs: [uintCV(habitId), uintCV(milestone)],
    network,
    senderAddress: c.contractAddress,
  });
  return unwrapOkBoolean(cvToJSON(cv));
}

/**
 * Fetch claim details for a habit + milestone combination.
 * Returns `null` if the milestone has not been claimed.
 */
export async function getClaimDetails(
  habitId: number,
  milestone: number,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<ClaimDetails | null> {
  const c = resolveContract(contract, MAINNET_REWARD_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-claim-details',
    functionArgs: [uintCV(habitId), uintCV(milestone)],
    network,
    senderAddress: c.contractAddress,
  });
  return parseClaimDetails(cvToJSON(cv));
}

/**
 * Fetch the total rewards distributed to date in microSTX.
 */
export async function getTotalDistributed(
  network: Network,
  contract?: Partial<ContractId>,
): Promise<number> {
  const c = resolveContract(contract, MAINNET_REWARD_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-total-distributed',
    functionArgs: [],
    network,
    senderAddress: c.contractAddress,
  });
  return unwrapOkNumber(cvToJSON(cv));
}
