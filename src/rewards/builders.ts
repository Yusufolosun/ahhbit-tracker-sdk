// ────────────────────────────────────────────────
// Streak Reward Transaction Builders
// ────────────────────────────────────────────────

import {
  uintCV,
  Pc,
  PostConditionMode,
} from '@stacks/transactions';
import type { ContractId } from '../types';
import { MAINNET_REWARD_CONTRACT } from '../constants';
import { resolveContract } from '../helpers';
import { assertPositiveInteger, assertFundAmount } from '../validation';

/**
 * Build arguments for `fund-reward-pool` contract call.
 * Anyone can contribute to the reward pool.
 *
 * @param amount - Amount to fund in microSTX (>= 10,000)
 * @param senderAddress - Address of the funder (for post-conditions)
 * @param contract - Optional contract override
 */
export function buildFundRewardPool(
  amount: number,
  senderAddress: string,
  contract?: Partial<ContractId>,
) {
  assertFundAmount(amount);
  const c = resolveContract(contract, MAINNET_REWARD_CONTRACT);
  return {
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'fund-reward-pool' as const,
    functionArgs: [uintCV(amount)],
    postConditions: [Pc.principal(senderAddress).willSendEq(amount).ustx()],
    postConditionMode: PostConditionMode.Deny,
  };
}

/**
 * Build arguments for `claim-milestone-reward` contract call.
 *
 * @param habitId - Habit to verify streak against
 * @param milestone - Milestone tier to claim (7, 14, 30, 60, or 90)
 * @param contract - Optional contract override
 */
export function buildClaimMilestoneReward(
  habitId: number,
  milestone: number,
  contract?: Partial<ContractId>,
) {
  assertPositiveInteger(habitId, 'habitId');
  assertPositiveInteger(milestone, 'milestone');
  const c = resolveContract(contract, MAINNET_REWARD_CONTRACT);
  return {
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'claim-milestone-reward' as const,
    functionArgs: [uintCV(habitId), uintCV(milestone)],
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
  };
}
