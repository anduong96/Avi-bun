import { $Enums } from '@prisma/client';

import { Nil } from '@app/types/nil';

type Value<T extends $Enums.ValueType> =
  T extends typeof $Enums.ValueType.BOOLEAN
    ? boolean
    : T extends typeof $Enums.ValueType.NUMBER
    ? number
    : T extends typeof $Enums.ValueType.STRING
    ? string
    : T extends typeof $Enums.ValueType.DATE
    ? Date
    : never;

type DiffChange<T extends $Enums.ValueType = $Enums.ValueType> =
  | {
      changeType: typeof $Enums.ChangeType.ADDED;
      currentValue: Value<T>;
      key: string;
      previousValue: Nil;
      valueType: T;
    }
  | {
      changeType: typeof $Enums.ChangeType.MODIFIED;
      currentValue: Value<T>;
      key: string;
      previousValue: Value<T>;
      valueType: T;
    }
  | {
      changeType: typeof $Enums.ChangeType.REMOVED;
      currentValue: Nil;
      key: string;
      previousValue: Value<T>;
      valueType: T;
    };

type DiffEntry = DiffChange & {
  description: string;
};
