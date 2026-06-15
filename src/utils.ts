// ────────────────────────────────────────────────
// Utilities — AhhbitTracker SDK v2.0.0
// ────────────────────────────────────────────────

import type { Habit, CheckInWindowState } from './types';
import { CHECK_IN_WINDOW, MIN_CHECK_IN_INTERVAL, MIN_STREAK_FOR_WITHDRAWAL } from './constants';

// ── STX Conversion ──────────────────────────────

const MICRO_PER_STX = 1_000_000;

/** Convert microSTX to STX. */
export function toSTX(microSTX: number): number {
  return microSTX / MICRO_PER_STX;
}

/** Convert STX to microSTX. */
export function toMicroSTX(stx: number): number {
  return Math.round(stx * MICRO_PER_STX);
}

/**
 * Format microSTX as a human-readable STX string.
 * @example formatSTX(1_500_000) // "1.50 STX"
 */
export function formatSTX(microSTX: number): string {
  const stx = toSTX(microSTX);
  return `${stx.toFixed(stx % 1 === 0 ? 0 : 2)} STX`;
}

// ── Address Formatting ──────────────────────────

/**
 * Shorten a Stacks address for display.
 * @example shortenAddress('SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z') // "SP1N...MP8Z"
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address || address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// ── Block Time Helpers ──────────────────────────

const MINUTES_PER_BLOCK = 10;

/**
 * Convert block count to a human-readable time string.
 * @example blocksToTime(96) // "~16 hours"
 */
export function blocksToTime(blocks: number): string {
  const minutes = blocks * MINUTES_PER_BLOCK;
  if (minutes < 60) return `~${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `~${hours} hour${hours === 1 ? '' : 's'}`;
  const days = Math.round(hours / 24);
  return `~${days} day${days === 1 ? '' : 's'}`;
}

// ── Check-In Window Logic ───────────────────────

/**
 * Threshold (in blocks) at which we consider the check-in window urgent.
 * The final ~2 hours of the valid window.
 */
const URGENT_THRESHOLD = CHECK_IN_WINDOW - 12;

/**
 * Derive the check-in window state for an active habit.
 * Returns 'unknown' when the current block height hasn't loaded yet.
 */
export function getCheckInWindowState(
  habit: Pick<Habit, 'isActive' | 'lastCheckInBlock'>,
  currentBlock: number | null,
): CheckInWindowState {
  if (!habit.isActive) return 'unknown';
  if (currentBlock === null) return 'unknown';

  const blocksElapsed = currentBlock - habit.lastCheckInBlock;

  if (blocksElapsed < 1) return 'just-checked-in';
  if (blocksElapsed > CHECK_IN_WINDOW) return 'expired';
  if (blocksElapsed < MIN_CHECK_IN_INTERVAL) return 'cooldown';
  if (blocksElapsed > URGENT_THRESHOLD) return 'urgent';
  return 'available';
}

/**
 * Number of blocks remaining before the check-in window expires.
 * Returns 0 if already expired.
 */
export function getBlocksRemaining(
  habit: Pick<Habit, 'lastCheckInBlock'>,
  currentBlock: number,
): number {
  const remaining = CHECK_IN_WINDOW - (currentBlock - habit.lastCheckInBlock);
  return Math.max(0, remaining);
}

/**
 * Number of blocks until the next valid check-in can be submitted.
 * Returns 0 when check-in is already available.
 */
export function getBlocksUntilNextCheckIn(
  habit: Pick<Habit, 'lastCheckInBlock'>,
  currentBlock: number,
): number {
  const wait = MIN_CHECK_IN_INTERVAL - (currentBlock - habit.lastCheckInBlock);
  return Math.max(0, wait);
}

/**
 * Whether the habit owner can withdraw their stake right now.
 */
export function isEligibleToWithdraw(
  habit: Pick<Habit, 'isActive' | 'currentStreak' | 'lastCheckInBlock'>,
  currentBlock: number | null,
): boolean {
  if (!habit.isActive || habit.currentStreak < MIN_STREAK_FOR_WITHDRAWAL) return false;
  const state = getCheckInWindowState(habit, currentBlock);
  return state !== 'expired' && state !== 'unknown';
}

/**
 * Whether a habit is currently eligible for a daily check-in.
 */
export function isEligibleForCheckIn(
  habit: Pick<Habit, 'isActive' | 'lastCheckInBlock'>,
  currentBlock: number | null,
): boolean {
  const state = getCheckInWindowState(habit, currentBlock);
  return state === 'available' || state === 'urgent' || state === 'expired';
}

// ── Transaction Helpers ─────────────────────────

/**
 * Normalize a transaction ID to include the `0x` prefix.
 */
export function normalizeTxId(txId: string): string {
  if (typeof txId !== 'string') return '';
  return txId.startsWith('0x') ? txId : `0x${txId}`;
}
