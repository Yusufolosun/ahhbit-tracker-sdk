import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as stxTx from '@stacks/transactions';
import {
  getMilestoneReward,
  getRewardPoolBalance,
  isMilestoneClaimed,
  getClaimDetails,
  getTotalDistributed,
} from '../src/rewards/queries';
import { MAINNET_REWARD_CONTRACT } from '../src/constants';

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

beforeEach(() => {
  mockFetch.mockReset();
});

describe('getMilestoneReward', () => {
  it('calls correct function and parses response', async () => {
    mockFetch.mockResolvedValue(
      stxTx.Cl.some(
        stxTx.Cl.tuple({
          'reward-amount': stxTx.Cl.uint(50_000),
        }),
      ),
    );

    const result = await getMilestoneReward(7, NETWORK);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: MAINNET_REWARD_CONTRACT.contractAddress,
        contractName: MAINNET_REWARD_CONTRACT.contractName,
        functionName: 'get-milestone-reward',
        functionArgs: [stxTx.Cl.uint(7)],
        network: NETWORK,
      }),
    );

    expect(result).not.toBeNull();
    expect(result!.rewardAmount).toBe(50_000);
  });

  it('returns null if response is none', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.none());
    const result = await getMilestoneReward(7, NETWORK);
    expect(result).toBeNull();
  });
});

describe('getRewardPoolBalance', () => {
  it('returns pool balance', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.ok(stxTx.Cl.uint(100_000)));
    const result = await getRewardPoolBalance(NETWORK);
    expect(result).toBe(100_000);
  });
});

describe('isMilestoneClaimed', () => {
  it('returns true if milestone claimed', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.ok(stxTx.Cl.bool(true)));
    const result = await isMilestoneClaimed(1, 14, NETWORK);
    expect(result).toBe(true);
  });

  it('returns false if milestone not claimed', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.ok(stxTx.Cl.bool(false)));
    const result = await isMilestoneClaimed(1, 14, NETWORK);
    expect(result).toBe(false);
  });
});

describe('getClaimDetails', () => {
  it('calls correct function and parses claim details response', async () => {
    mockFetch.mockResolvedValue(
      stxTx.Cl.some(
        stxTx.Cl.tuple({
          'claimed-by': stxTx.Cl.principal(USER),
          'claimed-at-block': stxTx.Cl.uint(150),
        }),
      ),
    );

    const result = await getClaimDetails(1, 14, NETWORK);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'get-claim-details',
        functionArgs: [stxTx.Cl.uint(1), stxTx.Cl.uint(14)],
      }),
    );

    expect(result).not.toBeNull();
    expect(result!.claimedBy).toBe(USER);
    expect(result!.claimedAtBlock).toBe(150);
  });

  it('returns null if response is none', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.none());
    const result = await getClaimDetails(1, 14, NETWORK);
    expect(result).toBeNull();
  });
});

describe('getTotalDistributed', () => {
  it('returns total count', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.ok(stxTx.Cl.uint(500_000)));
    const result = await getTotalDistributed(NETWORK);
    expect(result).toBe(500_000);
  });
});
