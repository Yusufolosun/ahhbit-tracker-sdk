import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as stxTx from '@stacks/transactions';
import {
  getGroup,
  getGroupShare,
  getMemberInfo,
  getMemberGroups,
  getTotalGroups,
} from '../src/groups/queries';
import { MAINNET_ACCOUNTABILITY_CONTRACT } from '../src/constants';

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

describe('getGroup', () => {
  it('calls correct function and parses response', async () => {
    mockFetch.mockResolvedValue(
      stxTx.Cl.some(
        stxTx.Cl.tuple({
          creator: stxTx.Cl.principal(USER),
          'stake-amount': stxTx.Cl.uint(1_000_000),
          'start-block': stxTx.Cl.uint(100),
          'end-block': stxTx.Cl.uint(244),
          'member-count': stxTx.Cl.uint(3),
          'is-active': stxTx.Cl.bool(true),
          'is-settled': stxTx.Cl.bool(false),
          'total-staked': stxTx.Cl.uint(3_000_000),
          'successful-count': stxTx.Cl.uint(0),
          'settled-count': stxTx.Cl.uint(0),
        }),
      ),
    );

    const result = await getGroup(1, NETWORK);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: MAINNET_ACCOUNTABILITY_CONTRACT.contractAddress,
        contractName: MAINNET_ACCOUNTABILITY_CONTRACT.contractName,
        functionName: 'get-group',
        functionArgs: [stxTx.Cl.uint(1)],
        network: NETWORK,
      }),
    );

    expect(result).not.toBeNull();
    expect(result!.creator).toBe(USER);
    expect(result!.stakeAmount).toBe(1_000_000);
    expect(result!.startBlock).toBe(100);
    expect(result!.endBlock).toBe(244);
    expect(result!.memberCount).toBe(3);
    expect(result!.isActive).toBe(true);
    expect(result!.isSettled).toBe(false);
    expect(result!.totalStaked).toBe(3_000_000);
  });

  it('returns null if response is none', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.none());
    const result = await getGroup(1, NETWORK);
    expect(result).toBeNull();
  });
});

describe('getGroupShare', () => {
  it('returns per-member share', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.ok(stxTx.Cl.uint(1_500_000)));
    const result = await getGroupShare(1, NETWORK);
    expect(result).toBe(1_500_000);
  });
});

describe('getMemberInfo', () => {
  it('calls correct function and parses group member response', async () => {
    mockFetch.mockResolvedValue(
      stxTx.Cl.some(
        stxTx.Cl.tuple({
          member: stxTx.Cl.principal(USER),
          'habit-id': stxTx.Cl.uint(2),
          'joined-at-block': stxTx.Cl.uint(105),
          'streak-at-join': stxTx.Cl.uint(5),
          'is-successful': stxTx.Cl.bool(true),
          'has-claimed': stxTx.Cl.bool(false),
        }),
      ),
    );

    const result = await getMemberInfo(1, USER, NETWORK);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'get-member-info',
        functionArgs: [stxTx.Cl.uint(1), stxTx.Cl.principal(USER)],
      }),
    );

    expect(result).not.toBeNull();
    expect(result!.member).toBe(USER);
    expect(result!.habitId).toBe(2);
    expect(result!.joinedAtBlock).toBe(105);
    expect(result!.streakAtJoin).toBe(5);
    expect(result!.isSuccessful).toBe(true);
    expect(result!.hasClaimed).toBe(false);
  });

  it('returns null if response is none', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.none());
    const result = await getMemberInfo(1, USER, NETWORK);
    expect(result).toBeNull();
  });
});

describe('getMemberGroups', () => {
  it('returns group IDs user is member of', async () => {
    mockFetch.mockResolvedValue(
      stxTx.Cl.tuple({
        'group-ids': stxTx.Cl.list([stxTx.Cl.uint(1), stxTx.Cl.uint(2)]),
      }),
    );

    const result = await getMemberGroups(USER, NETWORK);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'get-member-groups-list',
        functionArgs: [stxTx.Cl.principal(USER)],
      }),
    );
    expect(result.groupIds).toEqual([1, 2]);
  });
});

describe('getTotalGroups', () => {
  it('returns total count', async () => {
    mockFetch.mockResolvedValue(stxTx.Cl.ok(stxTx.Cl.uint(4)));
    const result = await getTotalGroups(NETWORK);
    expect(result).toBe(4);
  });
});
