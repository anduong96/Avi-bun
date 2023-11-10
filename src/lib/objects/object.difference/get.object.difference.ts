import { format } from 'sys';
import { isNil } from 'lodash';
import { ChangeType } from '@prisma/client';

import { Optional } from '@app/types/optional';
import { castAsPrimitiveValue } from '@app/lib/casts/cast.as.primitive.value';

import { DiffEntry } from './types';
import { getValueType } from './get.value.type';

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
