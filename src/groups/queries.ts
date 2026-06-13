// ────────────────────────────────────────────────
// Accountability Group Read-Only Queries
// ────────────────────────────────────────────────

import {
  uintCV,
  principalCV,
  fetchCallReadOnlyFunction,
  cvToJSON,
} from '@stacks/transactions';
import type { ContractId, Group, GroupMember, MemberGroups } from '../types';
import { MAINNET_ACCOUNTABILITY_CONTRACT } from '../constants';
import {
  resolveContract,
  parseGroup,
  parseGroupMember,
  parseMemberGroups,
  unwrapOkNumber,
} from '../helpers';

type Network = Parameters<typeof fetchCallReadOnlyFunction>[0]['network'];

/**
 * Fetch group details by ID. Returns `null` if not found.
 */
export async function getGroup(
  groupId: number,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<Group | null> {
  const c = resolveContract(contract, MAINNET_ACCOUNTABILITY_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-group',
    functionArgs: [uintCV(groupId)],
    network,
    senderAddress: c.contractAddress,
  });
  return parseGroup(cvToJSON(cv));
}

/**
 * Fetch the per-member share for a group's pool.
 * Returns 0 if no successful members.
 */
export async function getGroupShare(
  groupId: number,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<number> {
  const c = resolveContract(contract, MAINNET_ACCOUNTABILITY_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-group-share',
    functionArgs: [uintCV(groupId)],
    network,
    senderAddress: c.contractAddress,
  });
  return unwrapOkNumber(cvToJSON(cv));
}

/**
 * Fetch member info within a group. Returns `null` if not a member.
 */
export async function getMemberInfo(
  groupId: number,
  memberAddress: string,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<GroupMember | null> {
  const c = resolveContract(contract, MAINNET_ACCOUNTABILITY_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-member-info',
    functionArgs: [uintCV(groupId), principalCV(memberAddress)],
    network,
    senderAddress: c.contractAddress,
  });
  return parseGroupMember(cvToJSON(cv));
}

/**
 * Fetch group IDs that a user belongs to.
 */
export async function getMemberGroups(
  memberAddress: string,
  network: Network,
  contract?: Partial<ContractId>,
): Promise<MemberGroups> {
  const c = resolveContract(contract, MAINNET_ACCOUNTABILITY_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-member-groups-list',
    functionArgs: [principalCV(memberAddress)],
    network,
    senderAddress: c.contractAddress,
  });
  return parseMemberGroups(cvToJSON(cv));
}

/**
 * Fetch the total number of groups created.
 */
export async function getTotalGroups(
  network: Network,
  contract?: Partial<ContractId>,
): Promise<number> {
  const c = resolveContract(contract, MAINNET_ACCOUNTABILITY_CONTRACT);
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: c.contractAddress,
    contractName: c.contractName,
    functionName: 'get-total-groups',
    functionArgs: [],
    network,
    senderAddress: c.contractAddress,
  });
  return unwrapOkNumber(cvToJSON(cv));
}
