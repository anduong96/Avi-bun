import { ValueType } from '@prisma/client';

/**
 * The function `getValueType` determines the type of a given value.
 * @param {unknown} value - The `value` parameter is of type `unknown`, which means it can be any type.
 * @returns the value type of the input value.
 */
export function getValueType(value: unknown) {
  switch (typeof value) {
    case 'number':
      return ValueType.NUMBER;
    case 'string':
      return ValueType.STRING;
    case 'boolean':
      return ValueType.BOOLEAN;
    case 'object':
      if (value instanceof Date) {
        return ValueType.DATE;
      }
  }

  return undefined;
}
