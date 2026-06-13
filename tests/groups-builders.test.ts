import { describe, it, expect } from 'vitest';
import { PostConditionMode } from '@stacks/transactions';
import {
  buildCreateGroup,
  buildJoinGroup,
  buildSettleMember,
  buildClaimGroupReward,
  buildFinalizeGroup,
  buildRefundFailedGroup,
} from '../src/groups/builders';
import { MAINNET_ACCOUNTABILITY_CONTRACT } from '../src/constants';

const SENDER = 'SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z';
const MEMBER = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5';
const CUSTOM = {
  contractAddress: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  contractName: 'custom-groups',
};

describe('buildCreateGroup', () => {
  it('returns correct tx layout and asserts fields', () => {
    const tx = buildCreateGroup(1_000_000, 144, 2, SENDER);
    expect(tx.functionName).toBe('create-group');
    expect(tx.contractAddress).toBe(MAINNET_ACCOUNTABILITY_CONTRACT.contractAddress);
    expect(tx.contractName).toBe(MAINNET_ACCOUNTABILITY_CONTRACT.contractName);
    expect(tx.functionArgs).toHaveLength(3);
    expect(tx.postConditions).toHaveLength(1);
    expect(tx.postConditionMode).toBe(PostConditionMode.Deny);
  });

  it('respects custom contract override', () => {
    const tx = buildCreateGroup(1_000_000, 144, 2, SENDER, CUSTOM);
    expect(tx.contractAddress).toBe(CUSTOM.contractAddress);
    expect(tx.contractName).toBe(CUSTOM.contractName);
  });
});

describe('buildJoinGroup', () => {
  it('returns correct tx layout', () => {
    const tx = buildJoinGroup(1, 3, SENDER, 1_000_000);
    expect(tx.functionName).toBe('join-group');
    expect(tx.contractAddress).toBe(MAINNET_ACCOUNTABILITY_CONTRACT.contractAddress);
    expect(tx.contractName).toBe(MAINNET_ACCOUNTABILITY_CONTRACT.contractName);
    expect(tx.functionArgs).toHaveLength(2);
    expect(tx.postConditions).toHaveLength(1);
    expect(tx.postConditionMode).toBe(PostConditionMode.Deny);
  });

  it('respects custom contract override', () => {
    const tx = buildJoinGroup(1, 3, SENDER, 1_000_000, CUSTOM);
    expect(tx.contractAddress).toBe(CUSTOM.contractAddress);
    expect(tx.contractName).toBe(CUSTOM.contractName);
  });
});

describe('buildSettleMember', () => {
  it('creates settle-member call', () => {
    const tx = buildSettleMember(1, MEMBER);
    expect(tx.functionName).toBe('settle-member');
    expect(tx.contractAddress).toBe(MAINNET_ACCOUNTABILITY_CONTRACT.contractAddress);
    expect(tx.functionArgs).toHaveLength(2);
    expect(tx.postConditions).toHaveLength(0);
    expect(tx.postConditionMode).toBe(PostConditionMode.Deny);
  });

  it('rejects invalid inputs', () => {
    expect(() => buildSettleMember(0, MEMBER)).toThrow(RangeError);
    expect(() => buildSettleMember(1, '')).toThrow(RangeError);
  });

  it('respects custom contract override', () => {
    const tx = buildSettleMember(1, MEMBER, CUSTOM);
    expect(tx.contractAddress).toBe(CUSTOM.contractAddress);
  });
});

describe('buildClaimGroupReward', () => {
  it('creates claim-group-reward call', () => {
    const tx = buildClaimGroupReward(1);
    expect(tx.functionName).toBe('claim-group-reward');
    expect(tx.contractAddress).toBe(MAINNET_ACCOUNTABILITY_CONTRACT.contractAddress);
    expect(tx.functionArgs).toHaveLength(1);
    expect(tx.postConditions).toHaveLength(0);
  });

  it('respects custom contract override', () => {
    const tx = buildClaimGroupReward(1, CUSTOM);
    expect(tx.contractAddress).toBe(CUSTOM.contractAddress);
  });
});

describe('buildFinalizeGroup', () => {
  it('creates finalize-group call', () => {
    const tx = buildFinalizeGroup(1);
    expect(tx.functionName).toBe('finalize-group');
    expect(tx.contractAddress).toBe(MAINNET_ACCOUNTABILITY_CONTRACT.contractAddress);
    expect(tx.functionArgs).toHaveLength(1);
    expect(tx.postConditions).toHaveLength(0);
  });

  it('respects custom contract override', () => {
    const tx = buildFinalizeGroup(1, CUSTOM);
    expect(tx.contractAddress).toBe(CUSTOM.contractAddress);
  });
});

describe('buildRefundFailedGroup', () => {
  it('creates refund-failed-group call', () => {
    const tx = buildRefundFailedGroup(1, MEMBER);
    expect(tx.functionName).toBe('refund-failed-group');
    expect(tx.contractAddress).toBe(MAINNET_ACCOUNTABILITY_CONTRACT.contractAddress);
    expect(tx.functionArgs).toHaveLength(2);
    expect(tx.postConditions).toHaveLength(0);
  });

  it('rejects invalid inputs', () => {
    expect(() => buildRefundFailedGroup(0, MEMBER)).toThrow(RangeError);
    expect(() => buildRefundFailedGroup(1, '')).toThrow(RangeError);
  });

  it('respects custom contract override', () => {
    const tx = buildRefundFailedGroup(1, MEMBER, CUSTOM);
    expect(tx.contractAddress).toBe(CUSTOM.contractAddress);
  });
});
