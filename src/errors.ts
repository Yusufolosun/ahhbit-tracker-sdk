// ────────────────────────────────────────────────
// Errors — AhhbitTracker SDK v2.0.0
// ────────────────────────────────────────────────

import { type ErrorCodeValue, errorMessages } from './constants';

const CLARITY_ERROR_RE = /^\(err u(\d+)\)$/;

/**
 * Custom error class for AhhbitTracker contract errors.
 * Carries the numeric error code and a human-readable message.
 */
export class AhhbitError extends Error {
  /** The numeric Clarity error code (e.g. 103, 305). */
  readonly code: number;

  /** Whether this error originated from a Clarity `(err uXXX)` response. */
  readonly contractError: boolean;

  constructor(code: number, message?: string) {
    const resolvedMessage =
      message ?? errorMessages[code as ErrorCodeValue] ?? `Unknown contract error (code: ${code})`;
    super(resolvedMessage);
    this.name = 'AhhbitError';
    this.code = code;
    this.contractError = true;
  }
}

/**
 * Decode a Clarity error response string into an AhhbitError.
 * Accepts strings like `"(err u103)"` from transaction results.
 *
 * @returns AhhbitError if the string matches the Clarity error pattern, null otherwise.
 */
export function decodeContractError(repr: string): AhhbitError | null {
  if (!repr) return null;
  const match = repr.trim().match(CLARITY_ERROR_RE);
  if (!match?.[1]) return null;

  const code = Number.parseInt(match[1], 10);
  return new AhhbitError(code);
}

/**
 * Extract the numeric error code from a Clarity `(err uXXX)` string.
 *
 * @returns The error code number, or null if the string doesn't match.
 */
export function extractClarityErrorCode(repr: string | undefined): number | null {
  if (!repr) return null;
  const match = repr.trim().match(CLARITY_ERROR_RE);
  if (!match?.[1]) return null;
  return Number.parseInt(match[1], 10);
}

/**
 * Type guard: returns true if the given value is an AhhbitError instance.
 */
export function isAhhbitError(err: unknown): err is AhhbitError {
  return err instanceof AhhbitError;
}
