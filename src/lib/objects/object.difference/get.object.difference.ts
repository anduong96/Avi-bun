import { format } from 'sys';
import { isNil } from 'lodash';
import { ChangeType } from '@prisma/client';

import { Optional } from '@app/types/optional';
import { castAsPrimitiveValue } from '@app/lib/casts/cast.as.primitive.value';

import { DiffEntry } from './types';
import { getValueType } from './get.value.type';

/**
 * The `_getObjectDifferenceWithOpts` function compares two objects and returns an array of differences
 * between them, including added, removed, and modified properties.
 * @param {T} current - The current object that you want to compare with the previous object.
 * @param {T} previous - The `previous` parameter is the previous version of the object that you want
 * to compare with the current version.
 * @param {DiffEntry[]} diffs - An array of objects representing the differences between the current
 * and previous objects. Each object in the array has the following properties:
 * @param [rootPath] - The `rootPath` parameter is a string that represents the current path of the
 * object being compared. It is used to keep track of nested object properties.
 * @param [onDescription] - The `onDescription` parameter is a callback function that takes three
 * arguments: `key`, `value`, and `changeType`. It is optional and can be used to provide a custom
 * description for each difference entry in the result. If provided, the callback function should
 * return a string that represents the description
 * @returns an array of `DiffEntry` objects.
 */
export function _getObjectDifferenceWithOpts<
  T extends object,
  K extends ObjectPaths<T>,
>(
  current: T,
  previous: T,
  diffs: DiffEntry[] = [],
  rootPath = '',
  onDescription?: (
    key: K,
    value: unknown,
    changeType: ChangeType,
  ) => Optional<string>,
) {
  for (const key in current) {
    const currentPath = rootPath ? `${rootPath}.${key}` : key;
    const currentType = getValueType(current[key] ?? previous[key]);
    const currentKey = currentPath as K;

    if (!currentType) {
      continue;
    }

    if (typeof current[key] === 'object' && typeof previous[key] === 'object') {
      _getObjectDifferenceWithOpts(
        current[key] as object,
        previous[key] as object,
        diffs,
        currentPath,
        onDescription,
      );
    } else if (current[key] !== previous[key]) {
      const currentValue = castAsPrimitiveValue(current[key], currentType);
      const previousValue = castAsPrimitiveValue(previous[key], currentType);

      if (isNil(previous[key])) {
        const description =
          onDescription?.(currentKey, currentValue, ChangeType.ADDED) ??
          format('%s was added', currentPath);

        diffs.push({
          changeType: ChangeType.ADDED,
          currentValue: currentValue,
          description,
          key: currentPath,
          previousValue: null,
          valueType: currentType,
        });
      } else if (isNil(current[key])) {
        const description =
          onDescription?.(currentKey, currentValue, ChangeType.REMOVED) ??
          format('% was unset', currentPath);

        diffs.push({
          changeType: ChangeType.REMOVED,
          currentValue: undefined,
          description,
          key: currentPath,
          previousValue: previousValue,
          valueType: currentType,
        });
      } else if (current[key] !== previous[key]) {
        const description =
          onDescription?.(currentKey, currentValue, ChangeType.MODIFIED) ??
          format('%s was changed to %s', currentPath, currentValue);

        diffs.push({
          changeType: ChangeType.MODIFIED,
          currentValue,
          description,
          key: currentPath,
          previousValue,
          valueType: currentType,
        });
      }
    }
  }

  return diffs;
}

/**
 * The function `getObjectDifference` compares two objects and returns the differences between them,
 * optionally providing a description for each difference.
 * @param {T} current - The `current` parameter is the current object that you want to compare with the
 * previous object.
 * @param {T} previous - The `previous` parameter is the object that represents the previous state or
 * version of the object. It is used to compare against the `current` object and determine the
 * differences between them.
 * @param [onDescription] - The `onDescription` parameter is an optional callback function that can be
 * provided to customize the description of the differences between the `current` and `previous`
 * objects. It takes three parameters:
 * @returns the result of calling the `_getObjectDifferenceWithOpts` function with the provided
 * arguments.
 */
export function getObjectDifference<T extends object>(
  current: T,
  previous: T,
  onDescription?: (
    key: ObjectPaths<T>,
    value: unknown,
    changeType: ChangeType,
  ) => Optional<string>,
) {
  return _getObjectDifferenceWithOpts(current, previous, [], '', onDescription);
}
