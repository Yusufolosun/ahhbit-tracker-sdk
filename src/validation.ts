// ────────────────────────────────────────────────
// Validation — AhhbitTracker SDK v2.0.0
// ────────────────────────────────────────────────

import {
  MIN_STAKE_AMOUNT,
  MAX_STAKE_AMOUNT,
  MAX_HABIT_NAME_LENGTH,
  MIN_GROUP_DURATION,
  MAX_GROUP_DURATION,
  MIN_FUND_AMOUNT,
} from './constants';

/**
 * Assert that a value is a positive integer (>= 1).
 * @throws {RangeError} if the value is not a positive integer.
 */
export function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${label} must be a positive integer, got ${value}`);
  }
}

/**
 * Assert that a habit name meets contract requirements.
 * @throws {RangeError} if the name is empty or exceeds the max length.
 */
export function assertHabitName(name: string): void {
  if (typeof name !== 'string') {
    throw new TypeError(`Habit name must be a string, got ${typeof name}`);
  }
  if (name.length < 1 || name.length > MAX_HABIT_NAME_LENGTH) {
    throw new RangeError(
      `Habit name must be 1-${MAX_HABIT_NAME_LENGTH} characters, got ${name.length}`,
    );
  }
}

/**
 * Assert that a stake amount meets contract requirements.
 * @throws {RangeError} if the amount is below minimum or above maximum.
 */
export function assertStakeAmount(amount: number): void {
  if (!Number.isInteger(amount) || amount < MIN_STAKE_AMOUNT) {
    throw new RangeError(
      `Stake must be an integer >= ${MIN_STAKE_AMOUNT} microSTX, got ${amount}`,
    );
  }
  if (amount > MAX_STAKE_AMOUNT) {
    throw new RangeError(
      `Stake must not exceed ${MAX_STAKE_AMOUNT} microSTX (100 STX), got ${amount}`,
    );
  }
}

/**
 * Assert that a group duration is within allowed bounds.
 * @throws {RangeError} if the duration is outside the allowed range.
 */
export function assertGroupDuration(blocks: number): void {
  if (!Number.isInteger(blocks) || blocks < MIN_GROUP_DURATION || blocks > MAX_GROUP_DURATION) {
    throw new RangeError(
      `Group duration must be ${MIN_GROUP_DURATION}-${MAX_GROUP_DURATION} blocks, got ${blocks}`,
    );
  }
}

/**
 * Assert that a fund amount meets minimum requirements.
 * @throws {RangeError} if the amount is below minimum.
 */
export function assertFundAmount(amount: number): void {
  if (!Number.isInteger(amount) || amount < MIN_FUND_AMOUNT) {
    throw new RangeError(
      `Fund amount must be an integer >= ${MIN_FUND_AMOUNT} microSTX, got ${amount}`,
    );
  }
}

// ── Soft Validators (return error strings) ──────

/**
 * Validate a habit name for the contract requirements.
 * @returns Error message string if invalid, null if valid.
 */
export function validateHabitName(name: string): string | null {
  if (typeof name !== 'string' || name.trim().length === 0) {
    return 'Habit name cannot be empty';
  }
  if (name.length > MAX_HABIT_NAME_LENGTH) {
    return `Habit name too long (max ${MAX_HABIT_NAME_LENGTH} characters)`;
  }
  return null;
}

/**
 * Validate a stake amount in microSTX.
 * @returns Error message string if invalid, null if valid.
 */
export function validateStakeAmount(microSTX: number): string | null {
  if (!Number.isInteger(microSTX) || microSTX < MIN_STAKE_AMOUNT) {
    return `Minimum stake is ${MIN_STAKE_AMOUNT / 1_000_000} STX`;
  }
  if (microSTX > MAX_STAKE_AMOUNT) {
    return `Maximum stake is ${MAX_STAKE_AMOUNT / 1_000_000} STX`;
  }
  return null;
}

/**
 * Validate a group duration in blocks.
 * @returns Error message string if invalid, null if valid.
 */
export function validateGroupDuration(blocks: number): string | null {
  if (!Number.isInteger(blocks) || blocks < MIN_GROUP_DURATION) {
    return `Minimum duration is ${MIN_GROUP_DURATION} blocks (~1 day)`;
  }
  if (blocks > MAX_GROUP_DURATION) {
    return `Maximum duration is ${MAX_GROUP_DURATION} blocks (~90 days)`;
  }
  return null;
}
