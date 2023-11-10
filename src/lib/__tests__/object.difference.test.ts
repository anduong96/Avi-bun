import { format } from 'sys';
import { ChangeType } from '@prisma/client';
import { describe, expect, test } from 'bun:test';

import { getObjectDifference } from '../objects/object.difference/get.object.difference';

describe('lib::object.difference', () => {
  test('should return an empty object when the current and previous objects are the same', () => {
    const current = { a: 1, b: 2 };
    const previous = { a: 1, b: 2 };
    const result = getObjectDifference(current, previous);
    expect(result).toMatchSnapshot();
  });

  test('should return an object with the keys and values that have changed between the current and previous objects', () => {
    const current = { a: 1, b: 2 };
    const previous = { a: 1, b: 3 };
    const result = getObjectDifference(current, previous);
    expect(result).toMatchSnapshot();
  });

  test('should return an object with the keys and values that have changed between the current and previous objects, using a key transform function', () => {
    const current = { a: 1, b: 2 };
    const previous = { a: 1, b: 3 };
    const result = getObjectDifference(current, previous);
    expect(result).toMatchSnapshot();
  });

  test('should return an object with the keys and values that have been removed between the current and previous objects', () => {
    type Entry = { a: number; b?: number; c?: number; d?: number };
    const current: Entry = { a: 1, b: 2, d: undefined };
    const previous: Entry = { a: 1, c: 3, d: 4 };
    const result = getObjectDifference(
      current,
      previous,
      (key, value, changeType) => {
        return changeType === ChangeType.REMOVED
          ? format('%s was removed', key.toUpperCase())
          : changeType === ChangeType.ADDED
          ? format('%s was added as %s', key.toUpperCase(), value)
          : changeType === ChangeType.MODIFIED
          ? format('%s was changed to %s', key.toUpperCase(), value)
          : undefined;
      },
    );

    expect(result).toMatchSnapshot();
  });
});
