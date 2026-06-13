import { describe, it, expect } from 'vitest';
import { PostConditionMode } from '@stacks/transactions';
import {
  buildFundRewardPool,
  buildClaimMilestoneReward,
} from '../src/rewards/builders';
import { MAINNET_REWARD_CONTRACT } from '../src/constants';

const SENDER = 'SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z';
const CUSTOM = {
  contractAddress: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  contractName: 'custom-rewards',
};

describe('buildFundRewardPool', () => {
  it('returns correct tx structure with post-condition', () => {
    const tx = buildFundRewardPool(200_000, SENDER);
    expect(tx.functionName).toBe('fund-reward-pool');
    expect(tx.contractAddress).toBe(MAINNET_REWARD_CONTRACT.contractAddress);
    expect(tx.contractName).toBe(MAINNET_REWARD_CONTRACT.contractName);
    expect(tx.functionArgs).toHaveLength(1);
    expect(tx.postConditions).toHaveLength(1);
    expect(tx.postConditionMode).toBe(PostConditionMode.Deny);
  });

  it('asserts valid amount', () => {
    expect(() => buildFundRewardPool(5000, SENDER)).toThrow(RangeError);
  });

  it('respects custom contract override', () => {
    const tx = buildFundRewardPool(200_000, SENDER, CUSTOM);
    expect(tx.contractAddress).toBe(CUSTOM.contractAddress);
    expect(tx.contractName).toBe(CUSTOM.contractName);
  });
});

describe('buildClaimMilestoneReward', () => {
  it('returns correct tx structure', () => {
    const tx = buildClaimMilestoneReward(3, 14);
    expect(tx.functionName).toBe('claim-milestone-reward');
    expect(tx.contractAddress).toBe(MAINNET_REWARD_CONTRACT.contractAddress);
    expect(tx.contractName).toBe(MAINNET_REWARD_CONTRACT.contractName);
    expect(tx.functionArgs).toHaveLength(2);
    expect(tx.postConditions).toHaveLength(0);
    expect(tx.postConditionMode).toBe(PostConditionMode.Deny);
  });

  it('asserts positive inputs', () => {
    expect(() => buildClaimMilestoneReward(0, 14)).toThrow(RangeError);
    expect(() => buildClaimMilestoneReward(3, 0)).toThrow(RangeError);
  });

  it('respects custom contract override', () => {
    const tx = buildClaimMilestoneReward(3, 14, CUSTOM);
    expect(tx.contractAddress).toBe(CUSTOM.contractAddress);
    expect(tx.contractName).toBe(CUSTOM.contractName);
  });
});
