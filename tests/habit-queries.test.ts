import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as stxTx from '@stacks/transactions';
import {
  getHabit,
  getUserHabits,
  getHabitStreak,
  getPoolBalance,
  getTotalHabits,
  getUserStats,
  getForfeitStatus,
  getEstimatedBonusShare,
  getUnclaimedCompletedHabits,
  getUnclaimedCompletedWeight,
  getReferrer,
  getReferrerStats,
  getReferralBoost,
  getExpiredHabits,
} from '../src/habit/queries';
import { MAINNET_CONTRACT } from '../src/constants';

vi.mock('@stacks/transactions', async () => {
  const actual = await vi.importActual<typeof stxTx>('@stacks/transactions');
  return {
    ...actual,
    fetchCallReadOnlyFunction: vi.fn(),
  };
});

const mockFetch = stxTx.fetchCallReadOnlyFunction as ReturnType<typeof vi.fn>;
const NETWORK = 'mainnet';
const USER = 'SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z';
const REFERRER = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5';

beforeEach(() => {
  mockFetch.mockReset();
});

describe('getHabit', () => {
  it('calls contract with correct args and returns parsed habit', async () => {
    mockFetch.mockResolvedValue(
      stxTx.Cl.some(
        stxTx.Cl.tuple({
          owner: stxTx.Cl.principal(USER),
          name: stxTx.Cl.stringUtf8('Exercise'),
          'stake-amount': stxTx.Cl.uint(20000),
          'current-streak': stxTx.Cl.uint(5),
          'last-check-in-block': stxTx.Cl.uint(100),
          'created-at-block': stxTx.Cl.uint(90),
          'is-active': stxTx.Cl.bool(true),
          'is-completed': stxTx.Cl.bool(false),
          'bonus-weight': stxTx.Cl.uint(1),
          'bonus-claimed': stxTx.Cl.bool(false),
        }),
      ),
    );

    const result = await getHabit(1, NETWORK);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: MAINNET_CONTRACT.contractAddress,
        contractName: MAINNET_CONTRACT.contractName,
        functionName: 'get-habit',
        functionArgs: [stxTx.Cl.uint(1)],
        network: NETWORK,
      }),
    );

    expect(result).not.toBeNull();
    expect(result!.owner).toBe(USER);
    expect(result!.name).toBe('Exercise');
    expect(result!.stakeAmount).toBe(20000);
    expect(result!.currentStreak).toBe(5);
    expect(result!.bonusWeight).toBe(1);
  });

  it('returns null if response is none', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.none());
    const result = await getHabit(1, NETWORK);
    expect(result).toBeNull();
  });
});

describe('getUserHabits', () => {
  it('calls correct function and returns list of habit IDs', async () => {
    mockFetch.mockResolvedValue(
      stxTx.Cl.tuple({
        'habit-ids': stxTx.Cl.list([stxTx.Cl.uint(1), stxTx.Cl.uint(3)]),
      }),
    );

    const result = await getUserHabits(USER, NETWORK);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'get-user-habits',
        functionArgs: [stxTx.Cl.principal(USER)],
      }),
    );
    expect(result.habitIds).toEqual([1, 3]);
  });
});

describe('getHabitStreak', () => {
  it('returns streak as a number', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.ok(stxTx.Cl.uint(7)));
    const result = await getHabitStreak(1, NETWORK);
    expect(result).toBe(7);
  });
});

describe('getPoolBalance', () => {
  it('returns pool balance', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.ok(stxTx.Cl.uint(100_000)));
    const result = await getPoolBalance(NETWORK);
    expect(result).toBe(100_000);
  });
});

describe('getTotalHabits', () => {
  it('returns total count', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.ok(stxTx.Cl.uint(12)));
    const result = await getTotalHabits(NETWORK);
    expect(result).toBe(12);
  });
});

describe('getUserStats', () => {
  it('returns user stats object', async () => {
    mockFetch.mockResolvedValue(
      stxTx.Cl.ok(
        stxTx.Cl.tuple({
          'total-habits': stxTx.Cl.uint(2),
          'habit-ids': stxTx.Cl.list([stxTx.Cl.uint(1), stxTx.Cl.uint(2)]),
        }),
      ),
    );

    const result = await getUserStats(USER, NETWORK);
    expect(result.totalHabits).toBe(2);
    expect(result.habitIds).toEqual([1, 2]);
  });
});

describe('getForfeitStatus', () => {
  it('returns forfeit status parsed correctly', async () => {
    mockFetch.mockResolvedValue(
      stxTx.Cl.tuple({
        'habit-id': stxTx.Cl.uint(1),
        'is-active': stxTx.Cl.bool(true),
        'stake-amount': stxTx.Cl.uint(18000),
        'initial-stake': stxTx.Cl.uint(20000),
        'missed-windows': stxTx.Cl.uint(1),
        'unapplied-missed': stxTx.Cl.uint(0),
        'pending-penalty': stxTx.Cl.uint(0),
        'stake-after-penalty': stxTx.Cl.uint(18000),
        'is-in-penalty-zone': stxTx.Cl.bool(false),
        'blocks-until-next-miss': stxTx.Cl.uint(50),
        'pct-stake-remaining': stxTx.Cl.uint(90),
      }),
    );

    const result = await getForfeitStatus(1, NETWORK);
    expect(result.stakeAmount).toBe(18000);
    expect(result.initialStake).toBe(20000);
    expect(result.pctStakeRemaining).toBe(90);
    expect(result.isActive).toBe(true);
  });
});

describe('getEstimatedBonusShare', () => {
  it('returns share amount', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.ok(stxTx.Cl.uint(5000)));
    const result = await getEstimatedBonusShare(NETWORK);
    expect(result).toBe(5000);
  });
});

describe('getUnclaimedCompletedHabits', () => {
  it('returns count', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.ok(stxTx.Cl.uint(3)));
    const result = await getUnclaimedCompletedHabits(NETWORK);
    expect(result).toBe(3);
  });
});

describe('getUnclaimedCompletedWeight', () => {
  it('returns weight sum', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.ok(stxTx.Cl.uint(5)));
    const result = await getUnclaimedCompletedWeight(NETWORK);
    expect(result).toBe(5);
  });
});

describe('getReferrer', () => {
  it('returns referrer info when set', async () => {
    mockFetch.mockResolvedValue(
      stxTx.Cl.some(
        stxTx.Cl.tuple({
          referrer: stxTx.Cl.principal(REFERRER),
          'set-at-block': stxTx.Cl.uint(105),
        }),
      ),
    );

    const result = await getReferrer(USER, NETWORK);
    expect(result).not.toBeNull();
    expect(result!.referrer).toBe(REFERRER);
    expect(result!.setAtBlock).toBe(105);
  });

  it('returns null when referrer not set', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.none());
    const result = await getReferrer(USER, NETWORK);
    expect(result).toBeNull();
  });
});

describe('getReferrerStats', () => {
  it('returns referral success count', async () => {
    mockFetch.mockResolvedValue(
      stxTx.Cl.tuple({
        'successful-referrals': stxTx.Cl.uint(2),
      }),
    );

    const result = await getReferrerStats(REFERRER, NETWORK);
    expect(result.successfulReferrals).toBe(2);
  });
});

describe('getReferralBoost', () => {
  it('returns boost percentage/multiplier', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.ok(stxTx.Cl.uint(2)));
    const result = await getReferralBoost(USER, NETWORK);
    expect(result).toBe(2);
  });
});

describe('getExpiredHabits', () => {
  it('returns filtered list of expired habit IDs (excluding 0)', async () => {
    mockFetch.mockResolvedValue(
      stxTx.Cl.ok(
        stxTx.Cl.list([
          stxTx.Cl.uint(0),
          stxTx.Cl.uint(2),
          stxTx.Cl.uint(0),
          stxTx.Cl.uint(5),
        ]),
      ),
    );

    const result = await getExpiredHabits(USER, NETWORK);
    expect(result).toEqual([2, 5]);
  });
});
