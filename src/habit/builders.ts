// ────────────────────────────────────────────────
// Habit Transaction Builders — AhhbitTracker SDK
// ────────────────────────────────────────────────

import {
  uintCV,
  stringUtf8CV,
  principalCV,
  Pc,
  PostConditionMode,
} from '@stacks/transactions';
import type { ContractId } from '../types';
import { MAINNET_CONTRACT } from '../constants';
import { resolveContract, contractPrincipal } from '../helpers';
import { assertHabitName, assertStakeAmount, assertPositiveInteger } from '../validation';

/**
 * Build arguments for `create-habit` contract call.
 *
 * @param name - Habit name (1-50 UTF-8 characters)
 * @param stakeAmount - Stake in microSTX (20,000 – 100,000,000)
 * @param senderAddress - Address of the caller (for post-conditions)
 * @param contract - Optional contract override (defaults to mainnet)
 */
export function buildCreateHabit(
  name: string,
  stakeAmount: number,
  senderAddress: string,
  contract?: Partial<ContractId>,
) {
  assertHabitName(name);
  assertStakeAmount(stakeAmount);
  const c = resolveContract(contract, MAINNET_CONTRACT);
  return {
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'create-habit' as const,
    functionArgs: [stringUtf8CV(name), uintCV(stakeAmount)],
    postConditions: [Pc.principal(senderAddress).willSendEq(stakeAmount).ustx()],
    postConditionMode: PostConditionMode.Deny,
  };
}

/**
 * Build arguments for `check-in` contract call.
 *
 * @param habitId - ID of the habit to check in
 * @param contract - Optional contract override
 */
export function buildCheckIn(habitId: number, contract?: Partial<ContractId>) {
  assertPositiveInteger(habitId, 'habitId');
  const c = resolveContract(contract, MAINNET_CONTRACT);
  return {
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'check-in' as const,
    functionArgs: [uintCV(habitId)],
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
  };
}

/**
 * Build arguments for `slash-habit` contract call.
 * Anyone can call this on an expired habit.
 *
 * @param habitId - ID of the habit to slash
 * @param contract - Optional contract override
 */
export function buildSlashHabit(habitId: number, contract?: Partial<ContractId>) {
  assertPositiveInteger(habitId, 'habitId');
  const c = resolveContract(contract, MAINNET_CONTRACT);
  return {
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'slash-habit' as const,
    functionArgs: [uintCV(habitId)],
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
  };
}

/**
 * Build arguments for `withdraw-stake` contract call.
 *
 * Uses `willSendGte` instead of `willSendEq` because partial forfeits
 * in v3 can reduce the remaining stake below the original amount.
 *
 * @param habitId - Habit to withdraw from
 * @param stakeAmount - Expected minimum stake amount in microSTX (for post-condition)
 * @param contract - Optional contract override
 */
export function buildWithdrawStake(
  habitId: number,
  stakeAmount: number,
  contract?: Partial<ContractId>,
) {
  assertPositiveInteger(habitId, 'habitId');
  assertPositiveInteger(stakeAmount, 'stakeAmount');
  const c = resolveContract(contract, MAINNET_CONTRACT);
  return {
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'withdraw-stake' as const,
    functionArgs: [uintCV(habitId)],
    postConditions: [Pc.principal(contractPrincipal(c)).willSendGte(stakeAmount).ustx()],
    postConditionMode: PostConditionMode.Deny,
  };
}

/**
 * Build arguments for `claim-bonus` contract call.
 *
 * @param habitId - ID of a completed habit (proof of eligibility)
 * @param contract - Optional contract override
 */
export function buildClaimBonus(habitId: number, contract?: Partial<ContractId>) {
  assertPositiveInteger(habitId, 'habitId');
  const c = resolveContract(contract, MAINNET_CONTRACT);
  return {
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'claim-bonus' as const,
    functionArgs: [uintCV(habitId)],
    postConditions: [Pc.principal(contractPrincipal(c)).willSendGte(1).ustx()],
    postConditionMode: PostConditionMode.Deny,
  };
}

/**
 * Build arguments for `register-referrer` contract call.
 * One-time registration per user for on-chain attribution.
 *
 * @param referrer - Stacks address of the referrer
 * @param contract - Optional contract override
 */
export function buildRegisterReferrer(referrer: string, contract?: Partial<ContractId>) {
  if (!referrer || typeof referrer !== 'string') {
    throw new RangeError('referrer must be a non-empty string');
  }
  const c = resolveContract(contract, MAINNET_CONTRACT);
  return {
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'register-referrer' as const,
    functionArgs: [principalCV(referrer)],
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
  };
}
