import { describe, it, expect } from 'vitest';
import {
  MAINNET_CONTRACT,
  MAINNET_ACCOUNTABILITY_CONTRACT,
  MAINNET_REWARD_CONTRACT,
  TESTNET_CONTRACT,
  TESTNET_ACCOUNTABILITY_CONTRACT,
  TESTNET_REWARD_CONTRACT,
  MIN_STAKE_AMOUNT,
  MAX_STAKE_AMOUNT,
  MAX_HABIT_NAME_LENGTH,
  CHECK_IN_WINDOW,
  MIN_CHECK_IN_INTERVAL,
  MIN_STREAK_FOR_WITHDRAWAL,
  FORFEIT_BPS_PER_MISS,
  BPS_DENOMINATOR,
  MIN_ACTIVE_STAKE,
  REFERRAL_BOOST_PER_COMPLETION,
  MAX_REFERRAL_BOOST,
  MAX_GROUP_SIZE,
  MIN_GROUP_DURATION,
  MAX_GROUP_DURATION,
  BLOCKS_PER_DAY,
  MILESTONE_TIERS,
  MIN_FUND_AMOUNT,
  ErrorCode,
  errorMessages,
} from '../src/constants';

describe('constants', () => {
  it('exports mainnet contract identifiers', () => {
    expect(MAINNET_CONTRACT.contractAddress).toBe(
      'SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z',
    );
    expect(MAINNET_CONTRACT.contractName).toBe('habit-tracker-v3');

    expect(MAINNET_ACCOUNTABILITY_CONTRACT.contractAddress).toBe(
      'SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z',
    );
    expect(MAINNET_ACCOUNTABILITY_CONTRACT.contractName).toBe('habit-accountability-group-v3');

    expect(MAINNET_REWARD_CONTRACT.contractAddress).toBe(
      'SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z',
    );
    expect(MAINNET_REWARD_CONTRACT.contractName).toBe('habit-streak-reward-v3');
  });

  it('exports testnet contract identifiers', () => {
    expect(TESTNET_CONTRACT.contractAddress).toBe(
      'ST1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK1GA0CF0',
    );
    expect(TESTNET_CONTRACT.contractName).toBe('habit-tracker-v3');

    expect(TESTNET_ACCOUNTABILITY_CONTRACT.contractAddress).toBe(
      'ST1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK1GA0CF0',
    );
    expect(TESTNET_ACCOUNTABILITY_CONTRACT.contractName).toBe('habit-accountability-group-v3');

    expect(TESTNET_REWARD_CONTRACT.contractAddress).toBe(
      'ST1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK1GA0CF0',
    );
    expect(TESTNET_REWARD_CONTRACT.contractName).toBe('habit-streak-reward-v3');
  });

  it('matches on-chain constant values', () => {
    expect(MIN_STAKE_AMOUNT).toBe(20_000);
    expect(MAX_STAKE_AMOUNT).toBe(100_000_000);
    expect(MAX_HABIT_NAME_LENGTH).toBe(50);
    expect(CHECK_IN_WINDOW).toBe(192);
    expect(MIN_CHECK_IN_INTERVAL).toBe(96);
    expect(MIN_STREAK_FOR_WITHDRAWAL).toBe(7);
    expect(FORFEIT_BPS_PER_MISS).toBe(1000);
    expect(BPS_DENOMINATOR).toBe(10_000);
    expect(MIN_ACTIVE_STAKE).toBe(1000);
    expect(REFERRAL_BOOST_PER_COMPLETION).toBe(1);
    expect(MAX_REFERRAL_BOOST).toBe(10);
    expect(MAX_GROUP_SIZE).toBe(10);
    expect(MIN_GROUP_DURATION).toBe(144);
    expect(MAX_GROUP_DURATION).toBe(12_960);
    expect(BLOCKS_PER_DAY).toBe(144);
    expect(MILESTONE_TIERS).toEqual([7, 14, 30, 60, 90]);
    expect(MIN_FUND_AMOUNT).toBe(10_000);
  });

  it('defines all habit error codes', () => {
    expect(ErrorCode.NOT_AUTHORIZED).toBe(100);
    expect(ErrorCode.INVALID_STAKE_AMOUNT).toBe(101);
    expect(ErrorCode.INVALID_HABIT_NAME).toBe(102);
    expect(ErrorCode.HABIT_NOT_FOUND).toBe(103);
    expect(ErrorCode.NOT_HABIT_OWNER).toBe(104);
    expect(ErrorCode.ALREADY_CHECKED_IN).toBe(105);
    expect(ErrorCode.INSUFFICIENT_STREAK).toBe(107);
    expect(ErrorCode.HABIT_ALREADY_COMPLETED).toBe(108);
    expect(ErrorCode.POOL_INSUFFICIENT_BALANCE).toBe(109);
    expect(ErrorCode.BONUS_ALREADY_CLAIMED).toBe(111);
    expect(ErrorCode.HABIT_LIMIT_REACHED).toBe(112);
    expect(ErrorCode.STAKE_TOO_HIGH).toBe(113);
    expect(ErrorCode.REFERRER_ALREADY_SET).toBe(115);
    expect(ErrorCode.INVALID_REFERRER).toBe(116);
    expect(ErrorCode.SELF_REFERRAL).toBe(117);
  });

  it('defines streak reward error codes', () => {
    expect(ErrorCode.REWARD_NOT_AUTHORIZED).toBe(200);
    expect(ErrorCode.INVALID_MILESTONE).toBe(201);
    expect(ErrorCode.MILESTONE_ALREADY_CLAIMED).toBe(202);
    expect(ErrorCode.REWARD_INSUFFICIENT_STREAK).toBe(203);
    expect(ErrorCode.REWARD_INSUFFICIENT_FUNDS).toBe(204);
    expect(ErrorCode.REWARD_HABIT_NOT_FOUND).toBe(206);
    expect(ErrorCode.REWARD_NOT_HABIT_OWNER).toBe(207);
    expect(ErrorCode.REWARD_INVALID_AMOUNT).toBe(208);
    expect(ErrorCode.REWARD_NOT_SET).toBe(209);
  });

  it('defines accountability group error codes', () => {
    expect(ErrorCode.GROUP_NOT_AUTHORIZED).toBe(300);
    expect(ErrorCode.GROUP_NOT_FOUND).toBe(301);
    expect(ErrorCode.GROUP_FULL).toBe(302);
    expect(ErrorCode.ALREADY_GROUP_MEMBER).toBe(303);
    expect(ErrorCode.NOT_GROUP_MEMBER).toBe(304);
    expect(ErrorCode.GROUP_NOT_ACTIVE).toBe(305);
    expect(ErrorCode.GROUP_STILL_ACTIVE).toBe(306);
    expect(ErrorCode.GROUP_INVALID_STAKE).toBe(307);
    expect(ErrorCode.GROUP_INVALID_DURATION).toBe(308);
    expect(ErrorCode.GROUP_ALREADY_SETTLED).toBe(309);
    expect(ErrorCode.GROUP_ALREADY_CLAIMED).toBe(310);
    expect(ErrorCode.GROUP_NOT_ELIGIBLE).toBe(311);
    expect(ErrorCode.GROUP_INVALID_HABIT).toBe(312);
    expect(ErrorCode.GROUP_LIMIT_REACHED).toBe(313);
  });

  it('has an error message for every error code', () => {
    const codes = Object.values(ErrorCode);
    for (const code of codes) {
      expect(errorMessages[code]).toBeDefined();
      expect(typeof errorMessages[code]).toBe('string');
    }
  });
});
