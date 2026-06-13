import { describe, it, expect } from 'vitest';
import {
  toSTX,
  toMicroSTX,
  formatSTX,
  shortenAddress,
  blocksToTime,
  getCheckInWindowState,
  getBlocksRemaining,
  getBlocksUntilNextCheckIn,
  isEligibleToWithdraw,
  isEligibleForCheckIn,
  normalizeTxId,
} from '../src/utils';

describe('STX conversions', () => {
  it('converts microSTX to STX', () => {
    expect(toSTX(1_000_000)).toBe(1);
    expect(toSTX(1_500_000)).toBe(1.5);
    expect(toSTX(20_000)).toBe(0.02);
  });

  it('converts STX to microSTX', () => {
    expect(toMicroSTX(1)).toBe(1_000_000);
    expect(toMicroSTX(1.5)).toBe(1_500_000);
    expect(toMicroSTX(0.02)).toBe(20_000);
  });

  it('formats STX strings nicely', () => {
    expect(formatSTX(1_000_000)).toBe('1 STX');
    expect(formatSTX(1_500_000)).toBe('1.50 STX');
    expect(formatSTX(20_000)).toBe('0.02 STX');
  });
});

describe('shortenAddress', () => {
  it('shortens long Stacks addresses', () => {
    expect(shortenAddress('SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z')).toBe('SP1N38...MP8Z');
    expect(shortenAddress('SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z', 6)).toBe('SP1N3809...4JMP8Z');
  });

  it('returns short addresses or empty strings as-is', () => {
    expect(shortenAddress('SP1N')).toBe('SP1N');
    expect(shortenAddress('')).toBe('');
  });
});

describe('blocksToTime', () => {
  it('formats minutes', () => {
    expect(blocksToTime(2)).toBe('~20 minutes');
    expect(blocksToTime(5)).toBe('~50 minutes');
  });

  it('formats hours', () => {
    expect(blocksToTime(6)).toBe('~1 hour');
    expect(blocksToTime(12)).toBe('~2 hours');
    expect(blocksToTime(96)).toBe('~16 hours');
  });

  it('formats days', () => {
    expect(blocksToTime(288)).toBe('~2 days'); // 2880 mins = 48 hours = 2 days
    expect(blocksToTime(1000)).toBe('~7 days');
  });
});

describe('check-in window logic', () => {
  const activeHabit = {
    isActive: true,
    lastCheckInBlock: 100,
    currentStreak: 5,
  };

  const inactiveHabit = {
    isActive: false,
    lastCheckInBlock: 100,
    currentStreak: 5,
  };

  describe('getCheckInWindowState', () => {
    it('returns unknown if inactive or block height is null', () => {
      expect(getCheckInWindowState(inactiveHabit, 120)).toBe('unknown');
      expect(getCheckInWindowState(activeHabit, null)).toBe('unknown');
    });

    it('returns just-checked-in state', () => {
      expect(getCheckInWindowState(activeHabit, 100)).toBe('just-checked-in');
    });

    it('returns cooldown state', () => {
      expect(getCheckInWindowState(activeHabit, 150)).toBe('cooldown');
    });

    it('returns available state', () => {
      expect(getCheckInWindowState(activeHabit, 200)).toBe('available');
    });

    it('returns urgent state', () => {
      expect(getCheckInWindowState(activeHabit, 285)).toBe('urgent');
    });

    it('returns expired state', () => {
      expect(getCheckInWindowState(activeHabit, 300)).toBe('expired');
    });
  });

  describe('getBlocksRemaining', () => {
    it('calculates remaining blocks correctly', () => {
      expect(getBlocksRemaining(activeHabit, 150)).toBe(142); // 192 - 50 = 142
      expect(getBlocksRemaining(activeHabit, 300)).toBe(0);   // expired
    });
  });

  describe('getBlocksUntilNextCheckIn', () => {
    it('calculates blocks until next check-in correctly', () => {
      expect(getBlocksUntilNextCheckIn(activeHabit, 120)).toBe(76); // 96 - 20 = 76
      expect(getBlocksUntilNextCheckIn(activeHabit, 200)).toBe(0);  // available
    });
  });

  describe('isEligibleToWithdraw', () => {
    it('checks eligibility based on streak and window state', () => {
      // Habit is eligible with streak >= 7 and check-in window not expired
      const eligibleHabit = { ...activeHabit, currentStreak: 7 };
      expect(isEligibleToWithdraw(eligibleHabit, 200)).toBe(true);

      // Ineligible if streak is too low
      const lowStreakHabit = { ...activeHabit, currentStreak: 6 };
      expect(isEligibleToWithdraw(lowStreakHabit, 200)).toBe(false);

      // Ineligible if inactive
      const inactiveEligible = { ...inactiveHabit, currentStreak: 8 };
      expect(isEligibleToWithdraw(inactiveEligible, 200)).toBe(false);

      // Ineligible if expired
      expect(isEligibleToWithdraw(eligibleHabit, 300)).toBe(false);

      // Ineligible if currentBlock is null (unknown state)
      expect(isEligibleToWithdraw(eligibleHabit, null)).toBe(false);
    });
  });

  describe('isEligibleForCheckIn', () => {
    it('returns true if state is available, urgent, or expired', () => {
      expect(isEligibleForCheckIn(activeHabit, 100)).toBe(false); // just-checked-in
      expect(isEligibleForCheckIn(activeHabit, 150)).toBe(false); // cooldown
      expect(isEligibleForCheckIn(activeHabit, 200)).toBe(true);  // available
      expect(isEligibleForCheckIn(activeHabit, 285)).toBe(true);  // urgent
      expect(isEligibleForCheckIn(activeHabit, 300)).toBe(true);  // expired
    });
  });
});

describe('normalizeTxId', () => {
  it('prepends 0x if missing', () => {
    expect(normalizeTxId('abcd')).toBe('0xabcd');
  });

  it('keeps 0x prefix if already present', () => {
    expect(normalizeTxId('0xabcd')).toBe('0xabcd');
  });
});
