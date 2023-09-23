import { describe, expect, test } from 'bun:test';
import { fractionToPercent } from '../fraction.to.percent';

describe('fractionToPercent', () => {
  test('should return 0 when denominator is 0', () => {
    const numerator = 10;
    const denominator = 0;

    const result = fractionToPercent(numerator, denominator);
    expect(result).toBe(0);
  });

  test('should calculate the percentage correctly', () => {
    const numerator = 3;
    const denominator = 4;

    const result = fractionToPercent(numerator, denominator);
    expect(result).toBe(0.75);
  });

  test('should round the result to 2 decimal places', () => {
    const numerator = 1;
    const denominator = 3;

    const result = fractionToPercent(numerator, denominator);
    expect(result).toBe(0.33);
  });
});
