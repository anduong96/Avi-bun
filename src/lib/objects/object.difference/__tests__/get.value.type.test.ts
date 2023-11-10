import { ValueType } from '@prisma/client';
import { describe, expect, test } from 'bun:test';

import { getValueType } from '../get.value.type';

describe('lib::getValueType', () => {
  test('should return ValueType.NUMBER when given a number', () => {
    const result = getValueType(42);
    expect(result).toBe(ValueType.NUMBER);
  });

  test('should return ValueType.STRING when given a string', () => {
    const result = getValueType('hello');
    expect(result).toBe(ValueType.STRING);
  });

  test('should return ValueType.BOOLEAN when given a boolean', () => {
    const result = getValueType(true);
    expect(result).toBe(ValueType.BOOLEAN);
  });

  test('should return ValueType.DATE when given a Date object', () => {
    const date = new Date();
    const result = getValueType(date);
    expect(result).toBe(ValueType.DATE);
  });

  test('should return undefined when given any other type', () => {
    const result = getValueType(null);
    expect(result).toBeUndefined();
  });
});
