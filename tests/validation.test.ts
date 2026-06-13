import { describe, it, expect } from 'vitest';
import {
  assertPositiveInteger,
  assertHabitName,
  assertStakeAmount,
  assertGroupDuration,
  assertFundAmount,
  validateHabitName,
  validateStakeAmount,
  validateGroupDuration,
} from '../src/validation';
import {
  MIN_STAKE_AMOUNT,
  MAX_STAKE_AMOUNT,
  MIN_GROUP_DURATION,
  MAX_GROUP_DURATION,
  MIN_FUND_AMOUNT,
} from '../src/constants';

describe('assertPositiveInteger', () => {
  it('accepts positive integers', () => {
    expect(() => assertPositiveInteger(1, 'Test')).not.toThrow();
    expect(() => assertPositiveInteger(42, 'Test')).not.toThrow();
  });

  it('rejects zero, negatives, and floats', () => {
    expect(() => assertPositiveInteger(0, 'Test')).toThrow(RangeError);
    expect(() => assertPositiveInteger(-5, 'Test')).toThrow(RangeError);
    expect(() => assertPositiveInteger(1.5, 'Test')).toThrow(RangeError);
  });
});

describe('assertHabitName', () => {
  it('accepts valid names', () => {
    expect(() => assertHabitName('Exercise')).not.toThrow();
    expect(() => assertHabitName('a'.repeat(50))).not.toThrow();
  });

  it('rejects empty names or names that are too long', () => {
    expect(() => assertHabitName('')).toThrow(RangeError);
    expect(() => assertHabitName('a'.repeat(51))).toThrow(RangeError);
  });

  it('rejects non-string values', () => {
    expect(() => assertHabitName(undefined as any)).toThrow(TypeError);
    expect(() => assertHabitName(null as any)).toThrow(TypeError);
    expect(() => assertHabitName(123 as any)).toThrow(TypeError);
  });
});

describe('assertStakeAmount', () => {
  it('accepts valid stake amounts', () => {
    expect(() => assertStakeAmount(MIN_STAKE_AMOUNT)).not.toThrow();
    expect(() => assertStakeAmount(MAX_STAKE_AMOUNT)).not.toThrow();
    expect(() => assertStakeAmount(1_000_000)).not.toThrow();
  });

  it('rejects amounts too low or too high or non-integers', () => {
    expect(() => assertStakeAmount(MIN_STAKE_AMOUNT - 1)).toThrow(RangeError);
    expect(() => assertStakeAmount(MAX_STAKE_AMOUNT + 1)).toThrow(RangeError);
    expect(() => assertStakeAmount(100_000.5)).toThrow(RangeError);
  });
});

describe('assertGroupDuration', () => {
  it('accepts valid group durations', () => {
    expect(() => assertGroupDuration(MIN_GROUP_DURATION)).not.toThrow();
    expect(() => assertGroupDuration(MAX_GROUP_DURATION)).not.toThrow();
    expect(() => assertGroupDuration(1000)).not.toThrow();
  });

  it('rejects durations too low or too high or non-integers', () => {
    expect(() => assertGroupDuration(MIN_GROUP_DURATION - 1)).toThrow(RangeError);
    expect(() => assertGroupDuration(MAX_GROUP_DURATION + 1)).toThrow(RangeError);
    expect(() => assertGroupDuration(500.5)).toThrow(RangeError);
  });
});

describe('assertFundAmount', () => {
  it('accepts valid fund amounts', () => {
    expect(() => assertFundAmount(MIN_FUND_AMOUNT)).not.toThrow();
    expect(() => assertFundAmount(1_000_000)).not.toThrow();
  });

  it('rejects amounts too low or non-integers', () => {
    expect(() => assertFundAmount(MIN_FUND_AMOUNT - 1)).toThrow(RangeError);
    expect(() => assertFundAmount(50_000.5)).toThrow(RangeError);
  });
});

describe('validateHabitName', () => {
  it('returns null for valid names', () => {
    expect(validateHabitName('Study')).toBeNull();
  });

  it('returns error string for invalid names', () => {
    expect(validateHabitName('')).toBe('Habit name cannot be empty');
    expect(validateHabitName('   ')).toBe('Habit name cannot be empty');
    expect(validateHabitName('a'.repeat(51))).toBe('Habit name too long (max 50 characters)');
  });
});

describe('validateStakeAmount', () => {
  it('returns null for valid stakes', () => {
    expect(validateStakeAmount(1_000_000)).toBeNull();
  });

  it('returns error string for invalid stakes', () => {
    expect(validateStakeAmount(MIN_STAKE_AMOUNT - 1)).toBe('Minimum stake is 0.02 STX');
    expect(validateStakeAmount(MAX_STAKE_AMOUNT + 1)).toBe('Maximum stake is 100 STX');
  });
});

describe('validateGroupDuration', () => {
  it('returns null for valid durations', () => {
    expect(validateGroupDuration(500)).toBeNull();
  });

  it('returns error string for invalid durations', () => {
    expect(validateGroupDuration(MIN_GROUP_DURATION - 1)).toBe('Minimum duration is 144 blocks (~1 day)');
    expect(validateGroupDuration(MAX_GROUP_DURATION + 1)).toBe('Maximum duration is 12960 blocks (~90 days)');
  });
});
