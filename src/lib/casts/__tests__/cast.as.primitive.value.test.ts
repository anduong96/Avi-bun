import { ValueType } from '@prisma/client';
import { describe, expect, test } from 'bun:test';

import { castAsPrimitiveValue } from '../cast.as.primitive.value';

describe('lib::castAsPrimitiveValue', () => {
  test('should cast boolean value correctly', () => {
    expect(castAsPrimitiveValue(true, ValueType.BOOLEAN)).toBe(true);
    expect(castAsPrimitiveValue(false, ValueType.BOOLEAN)).toBe(false);
    expect(() => castAsPrimitiveValue(123, ValueType.BOOLEAN)).toThrow(Error);
    expect(() => castAsPrimitiveValue('true', ValueType.BOOLEAN)).toThrow(
      Error,
    );
    expect(() => castAsPrimitiveValue(new Date(), ValueType.BOOLEAN)).toThrow(
      Error,
    );
  });

  test('should cast number value correctly', () => {
    expect(castAsPrimitiveValue(123, ValueType.NUMBER)).toBe(123);
    expect(castAsPrimitiveValue(0, ValueType.NUMBER)).toBe(0);
    expect(() => castAsPrimitiveValue(true, ValueType.NUMBER)).toThrow(Error);
    expect(() => castAsPrimitiveValue('123', ValueType.NUMBER)).toThrow(Error);
    expect(() => castAsPrimitiveValue(new Date(), ValueType.NUMBER)).toThrow(
      Error,
    );
  });

  test('should cast string value correctly', () => {
    expect(castAsPrimitiveValue('hello', ValueType.STRING)).toBe('hello');
    expect(castAsPrimitiveValue('', ValueType.STRING)).toBe('');
    expect(() => castAsPrimitiveValue(true, ValueType.STRING)).toThrow(Error);
    expect(() => castAsPrimitiveValue(123, ValueType.STRING)).toThrow(Error);
    expect(() => castAsPrimitiveValue(new Date(), ValueType.STRING)).toThrow(
      Error,
    );
  });

  test('should cast date value correctly', () => {
    const date = new Date();
    expect(castAsPrimitiveValue(date, ValueType.DATE)).toBe(date);
    expect(() => castAsPrimitiveValue(true, ValueType.DATE)).toThrow(Error);
    expect(() => castAsPrimitiveValue(123, ValueType.DATE)).toThrow(Error);
    expect(() => castAsPrimitiveValue('2022-01-01', ValueType.DATE)).toThrow(
      Error,
    );
  });
});
