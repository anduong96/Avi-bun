import { ValueType } from '@prisma/client';
import { describe, expect, test } from 'bun:test';

import { castAsPrimitiveValue } from '../casts/cast.as.primitive.value';

describe('lib::castAsPrimitiveValue', () => {
  test('should cast a boolean value to boolean', () => {
    const value = true;
    const type = ValueType.BOOLEAN;
    const result = castAsPrimitiveValue(value, type);
    expect(result).toBe(value);
  });

  test('should cast a number value to number', () => {
    const value = 42;
    const type = ValueType.NUMBER;
    const result = castAsPrimitiveValue(value, type);
    expect(result).toBe(value);
  });

  test('should cast a string value to string', () => {
    const value = 'hello';
    const type = ValueType.STRING;
    const result = castAsPrimitiveValue(value, type);
    expect(result).toBe(value);
  });

  test('should cast a Date instance to Date', () => {
    const value = new Date();
    const type = ValueType.DATE;
    const result = castAsPrimitiveValue(value, type);
    expect(result).toBe(value);
  });

  test('should throw an error for unsupported value types', () => {
    const value = 'hello';
    const type = 'unsupported' as ValueType;
    expect(() => castAsPrimitiveValue(value, type)).toThrow(Error);
  });
});
