// ────────────────────────────────────────────────
// Accountability Group Transaction Builders
// ────────────────────────────────────────────────

import {
  uintCV,
  principalCV,
  Pc,
  PostConditionMode,
} from '@stacks/transactions';
import type { ContractId } from '../types';
import { MAINNET_ACCOUNTABILITY_CONTRACT } from '../constants';
import { resolveContract } from '../helpers';
import { assertPositiveInteger, assertStakeAmount, assertGroupDuration } from '../validation';

/**
 * Build arguments for `create-group` contract call.
 *
 * @param stakeAmount - STX stake per member in microSTX
 * @param duration - Group duration in blocks (144–12960)
 * @param habitId - Caller's active habit ID
 * @param senderAddress - Address of the caller (for post-conditions)
 * @param contract - Optional contract override
 */
export function buildCreateGroup(
  stakeAmount: number,
  duration: number,
  habitId: number,
  senderAddress: string,
  contract?: Partial<ContractId>,
) {
  assertStakeAmount(stakeAmount);
  assertGroupDuration(duration);
  assertPositiveInteger(habitId, 'habitId');
  const c = resolveContract(contract, MAINNET_ACCOUNTABILITY_CONTRACT);
  return {
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'create-group' as const,
    functionArgs: [uintCV(stakeAmount), uintCV(duration), uintCV(habitId)],
    postConditions: [Pc.principal(senderAddress).willSendEq(stakeAmount).ustx()],
    postConditionMode: PostConditionMode.Deny,
  };
}

/**
 * Build arguments for `join-group` contract call.
 *
 * @param groupId - ID of the group to join
 * @param habitId - Caller's active habit ID
 * @param senderAddress - Address of the caller (for post-conditions)
 * @param groupStakeAmount - The group's stake amount in microSTX
 * @param contract - Optional contract override
 */
export function buildJoinGroup(
  groupId: number,
  habitId: number,
  senderAddress: string,
  groupStakeAmount: number,
  contract?: Partial<ContractId>,
) {
  assertPositiveInteger(groupId, 'groupId');
  assertPositiveInteger(habitId, 'habitId');
  assertPositiveInteger(groupStakeAmount, 'groupStakeAmount');
  const c = resolveContract(contract, MAINNET_ACCOUNTABILITY_CONTRACT);
  return {
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'join-group' as const,
    functionArgs: [uintCV(groupId), uintCV(habitId)],
    postConditions: [Pc.principal(senderAddress).willSendEq(groupStakeAmount).ustx()],
    postConditionMode: PostConditionMode.Deny,
  };
}

/**
 * Build arguments for `settle-member` contract call.
 * Permissionless — anyone can settle a member after the group ends.
 *
 * @param groupId - Group ID
 * @param memberAddress - Member principal to settle
 * @param contract - Optional contract override
 */
export function buildSettleMember(
  groupId: number,
  memberAddress: string,
  contract?: Partial<ContractId>,
) {
  assertPositiveInteger(groupId, 'groupId');
  if (!memberAddress || typeof memberAddress !== 'string') {
    throw new RangeError('memberAddress must be a non-empty string');
  }
  const c = resolveContract(contract, MAINNET_ACCOUNTABILITY_CONTRACT);
  return {
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'settle-member' as const,
    functionArgs: [uintCV(groupId), principalCV(memberAddress)],
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
  };
}

/**
 * Build arguments for `claim-group-reward` contract call.
 *
 * @param groupId - Group ID
 * @param contract - Optional contract override
 */
export function buildClaimGroupReward(groupId: number, contract?: Partial<ContractId>) {
  assertPositiveInteger(groupId, 'groupId');
  const c = resolveContract(contract, MAINNET_ACCOUNTABILITY_CONTRACT);
  return {
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'claim-group-reward' as const,
    functionArgs: [uintCV(groupId)],
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
  };
}

/**
 * Build arguments for `finalize-group` contract call.
 * Must be called after all members have been settled.
 *
 * @param groupId - Group ID
 * @param contract - Optional contract override
 */
export function buildFinalizeGroup(groupId: number, contract?: Partial<ContractId>) {
  assertPositiveInteger(groupId, 'groupId');
  const c = resolveContract(contract, MAINNET_ACCOUNTABILITY_CONTRACT);
  return {
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'finalize-group' as const,
    functionArgs: [uintCV(groupId)],
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
  };
}

/**
 * Build arguments for `refund-failed-group` contract call.
 * Refunds stake when ALL members in a group failed.
 *
 * @param groupId - Group ID
 * @param memberAddress - Member to refund
 * @param contract - Optional contract override
 */
export function buildRefundFailedGroup(
  groupId: number,
  memberAddress: string,
  contract?: Partial<ContractId>,
) {
  assertPositiveInteger(groupId, 'groupId');
  if (!memberAddress || typeof memberAddress !== 'string') {
    throw new RangeError('memberAddress must be a non-empty string');
  }
  const c = resolveContract(contract, MAINNET_ACCOUNTABILITY_CONTRACT);
  return {
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'refund-failed-group' as const,
    functionArgs: [uintCV(groupId), principalCV(memberAddress)],
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
  };
}
