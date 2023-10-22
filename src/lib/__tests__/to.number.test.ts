import { describe, expect, test } from 'bun:test';

import { toNumber } from '../to.number';

describe('Lib::toNumber', () => {
  test('toNumber', () => {
    expect(toNumber('123')).toBe(123);
    expect(toNumber('123.456')).toBe(123.456);
    expect(toNumber('-123.456')).toBe(-123.456);
    expect(toNumber('-123')).toBe(-123);
    expect(toNumber('')).toBe(0);
    expect(toNumber(undefined)).toBe(0);
    expect(toNumber(null)).toBe(0);
    expect(toNumber('abc')).toBe(0);
    expect(toNumber('-abc')).toBe(0);
    expect(toNumber('123abc')).toBe(123);
    expect(toNumber('-123abc')).toBe(-123);
    expect(toNumber('123.456abc')).toBe(123.456);
    expect(toNumber('-123.456abc')).toBe(-123.456);
    expect(toNumber('123.456.789abc')).toBe(123.456);
    expect(toNumber('-123.456.789abc')).toBe(-123.456);
    expect(toNumber('123.456.789.123abc')).toBe(123.456);
  });
});
