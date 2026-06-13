import { describe, it, expect } from 'vitest';
import { PostConditionMode } from '@stacks/transactions';
import {
  buildCreateHabit,
  buildCheckIn,
  buildSlashHabit,
  buildWithdrawStake,
  buildClaimBonus,
  buildRegisterReferrer,
} from '../src/habit/builders';
import { MAINNET_CONTRACT } from '../src/constants';

const SENDER = 'SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z';
const REFERRER = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5';
const CUSTOM = {
  contractAddress: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  contractName: 'custom-tracker',
};

describe('buildCreateHabit', () => {
  it('returns correct function name, contract, args, and post-conditions', () => {
    const tx = buildCreateHabit('Exercise', 100_000, SENDER);
    expect(tx.functionName).toBe('create-habit');
    expect(tx.contractAddress).toBe(MAINNET_CONTRACT.contractAddress);
    expect(tx.contractName).toBe(MAINNET_CONTRACT.contractName);
    expect(tx.functionArgs).toHaveLength(2);
    expect(tx.postConditions).toHaveLength(1);
    expect(tx.postConditionMode).toBe(PostConditionMode.Deny);
  });

  it('respects custom contract override', () => {
    const tx = buildCreateHabit('Exercise', 100_000, SENDER, CUSTOM);
    expect(tx.contractAddress).toBe(CUSTOM.contractAddress);
    expect(tx.contractName).toBe(CUSTOM.contractName);
  });
});

describe('buildCheckIn', () => {
  it('returns correct function name, contract, and args', () => {
    const tx = buildCheckIn(5);
    expect(tx.functionName).toBe('check-in');
    expect(tx.contractAddress).toBe(MAINNET_CONTRACT.contractAddress);
    expect(tx.contractName).toBe(MAINNET_CONTRACT.contractName);
    expect(tx.functionArgs).toHaveLength(1);
    expect(tx.postConditions).toHaveLength(0);
    expect(tx.postConditionMode).toBe(PostConditionMode.Deny);
  });

  it('respects custom contract override', () => {
    const tx = buildCheckIn(5, CUSTOM);
    expect(tx.contractAddress).toBe(CUSTOM.contractAddress);
    expect(tx.contractName).toBe(CUSTOM.contractName);
  });
});

describe('buildSlashHabit', () => {
  it('returns correct function name, contract, and args', () => {
    const tx = buildSlashHabit(10);
    expect(tx.functionName).toBe('slash-habit');
    expect(tx.contractAddress).toBe(MAINNET_CONTRACT.contractAddress);
    expect(tx.contractName).toBe(MAINNET_CONTRACT.contractName);
    expect(tx.functionArgs).toHaveLength(1);
    expect(tx.postConditions).toHaveLength(0);
    expect(tx.postConditionMode).toBe(PostConditionMode.Deny);
  });

  it('respects custom contract override', () => {
    const tx = buildSlashHabit(10, CUSTOM);
    expect(tx.contractAddress).toBe(CUSTOM.contractAddress);
    expect(tx.contractName).toBe(CUSTOM.contractName);
  });
});

describe('buildWithdrawStake', () => {
  it('uses willSendGte instead of willSendEq in post-conditions', () => {
    const tx = buildWithdrawStake(3, 50_000);
    expect(tx.functionName).toBe('withdraw-stake');
    expect(tx.contractAddress).toBe(MAINNET_CONTRACT.contractAddress);
    expect(tx.contractName).toBe(MAINNET_CONTRACT.contractName);
    expect(tx.functionArgs).toHaveLength(1);
    expect(tx.postConditions).toHaveLength(1);
    expect(tx.postConditionMode).toBe(PostConditionMode.Deny);
  });

  it('respects custom contract override in post-conditions', () => {
    const tx = buildWithdrawStake(3, 50_000, CUSTOM);
    expect(tx.contractAddress).toBe(CUSTOM.contractAddress);
    expect(tx.contractName).toBe(CUSTOM.contractName);
  });
});

describe('buildClaimBonus', () => {
  it('creates claim bonus tx with willSendGte post-condition', () => {
    const tx = buildClaimBonus(2);
    expect(tx.functionName).toBe('claim-bonus');
    expect(tx.contractAddress).toBe(MAINNET_CONTRACT.contractAddress);
    expect(tx.contractName).toBe(MAINNET_CONTRACT.contractName);
    expect(tx.functionArgs).toHaveLength(1);
    expect(tx.postConditions).toHaveLength(1);
    expect(tx.postConditionMode).toBe(PostConditionMode.Deny);
  });

  it('respects custom contract override', () => {
    const tx = buildClaimBonus(2, CUSTOM);
    expect(tx.contractAddress).toBe(CUSTOM.contractAddress);
    expect(tx.contractName).toBe(CUSTOM.contractName);
  });
});

describe('buildRegisterReferrer', () => {
  it('creates registration transaction', () => {
    const tx = buildRegisterReferrer(REFERRER);
    expect(tx.functionName).toBe('register-referrer');
    expect(tx.contractAddress).toBe(MAINNET_CONTRACT.contractAddress);
    expect(tx.contractName).toBe(MAINNET_CONTRACT.contractName);
    expect(tx.functionArgs).toHaveLength(1);
    expect(tx.postConditions).toHaveLength(0);
    expect(tx.postConditionMode).toBe(PostConditionMode.Deny);
  });

  it('rejects empty or non-string referrer', () => {
    expect(() => buildRegisterReferrer('')).toThrow(RangeError);
    expect(() => buildRegisterReferrer(null as any)).toThrow(RangeError);
  });

  it('respects custom contract override', () => {
    const tx = buildRegisterReferrer(REFERRER, CUSTOM);
    expect(tx.contractAddress).toBe(CUSTOM.contractAddress);
    expect(tx.contractName).toBe(CUSTOM.contractName);
  });
});
