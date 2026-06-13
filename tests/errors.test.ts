import { describe, it, expect } from 'vitest';
import {
  AhhbitError,
  decodeContractError,
  extractClarityErrorCode,
  isAhhbitError,
} from '../src/errors';
import { ErrorCode } from '../src/constants';

describe('AhhbitError', () => {
  it('instantiates correctly with known code', () => {
    const err = new AhhbitError(ErrorCode.HABIT_NOT_FOUND);
    expect(err.code).toBe(ErrorCode.HABIT_NOT_FOUND);
    expect(err.contractError).toBe(true);
    expect(err.name).toBe('AhhbitError');
    expect(err.message).toBe('Habit not found');
  });

  it('instantiates with custom message', () => {
    const err = new AhhbitError(999, 'Custom message');
    expect(err.code).toBe(999);
    expect(err.message).toBe('Custom message');
  });

  it('falls back to a default message for unknown code', () => {
    const err = new AhhbitError(999);
    expect(err.code).toBe(999);
    expect(err.message).toBe('Unknown contract error (code: 999)');
  });
});

describe('decodeContractError', () => {
  it('decodes standard clarity error string', () => {
    const err = decodeContractError('(err u103)');
    expect(err).not.toBeNull();
    expect(err!.code).toBe(103);
    expect(err!.message).toBe('Habit not found');
  });

  it('decodes group errors', () => {
    const err = decodeContractError('(err u305)');
    expect(err).not.toBeNull();
    expect(err!.code).toBe(305);
    expect(err!.message).toBe('Group is no longer active');
  });

  it('handles spaces or weird formatting', () => {
    const err = decodeContractError('  (err u103)  ');
    expect(err).not.toBeNull();
    expect(err!.code).toBe(103);
  });

  it('returns null for non-matching string', () => {
    expect(decodeContractError('')).toBeNull();
    expect(decodeContractError('some error')).toBeNull();
    expect(decodeContractError('(ok u103)')).toBeNull();
    expect(decodeContractError('(err 103)')).toBeNull();
  });
});

describe('extractClarityErrorCode', () => {
  it('extracts code from valid repr', () => {
    expect(extractClarityErrorCode('(err u105)')).toBe(105);
    expect(extractClarityErrorCode('  (err u306) ')).toBe(306);
  });

  it('returns null for invalid repr', () => {
    expect(extractClarityErrorCode(undefined)).toBeNull();
    expect(extractClarityErrorCode('')).toBeNull();
    expect(extractClarityErrorCode('u105')).toBeNull();
  });
});

describe('isAhhbitError', () => {
  it('identifies instances of AhhbitError', () => {
    const err = new AhhbitError(103);
    expect(isAhhbitError(err)).toBe(true);
    expect(isAhhbitError(new Error('Generic'))).toBe(false);
    expect(isAhhbitError(null)).toBe(false);
    expect(isAhhbitError({})).toBe(false);
  });
});
