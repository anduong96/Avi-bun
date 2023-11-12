import { $Enums, ValueType } from '@prisma/client';

import { Logger } from '../logger';

/**
 * The function `castAsPrimitiveValue` is a TypeScript function that takes an unknown value and a value
 * type, and returns the value casted to the specified type if it matches, otherwise it throws an
 * error.
 * @param {unknown} value - The `value` parameter is of type `unknown`, which means it can be any type.
 * It represents the value that needs to be casted to a primitive value.
 * @param {T} type - The `type` parameter is the type of value that you want to cast `value` to. It can
 * be one of the following types: `ValueType.BOOLEAN`, `ValueType.NUMBER`, `ValueType.STRING`, or
 * `ValueType.DATE`.
 * @returns the value casted as the specified primitive type. The specific primitive type is determined
 * by the `type` parameter, which can be one of the `ValueType` enum values: `BOOLEAN`, `NUMBER`,
 * `STRING`, or `DATE`. The return type of the function is determined by the `Result` type, which is a
 * conditional type that maps each `ValueType` enum value to
 */
export function castAsPrimitiveValue<T extends ValueType, V>(
  value: V,
  type: T,
) {
  type Result = T extends typeof $Enums.ValueType.BOOLEAN
    ? boolean
    : T extends typeof $Enums.ValueType.NUMBER
    ? number
    : T extends typeof $Enums.ValueType.STRING
    ? string
    : T extends typeof $Enums.ValueType.DATE
    ? Date
    : never;

  if (type === ValueType.BOOLEAN && typeof value === 'boolean') {
    return value as Result;
  } else if (type === ValueType.NUMBER && typeof value === 'number') {
    return value as Result;
  } else if (type === ValueType.STRING && typeof value === 'string') {
    return value as Result;
  } else if (type === ValueType.DATE && value instanceof Date) {
    return value as Result;
  }

  Logger.warn('Unsupported value: value=%s type=%s', value, type);
  throw new Error('Unsupported value type');
}
