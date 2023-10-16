import type { BasicObject, PartialBy } from './common';

// Cosmetic use only makes the tooltips ex-pad the type can be removed
type Id<T> = {} & { [P in keyof T]: T[P] };

type ObjectId = { _bsontype: 'ObjectID' };

type OmitDistributive<
  T extends BasicObject,
  K extends keyof T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = T extends any
  ? T extends object
    ? T extends Date | ObjectId
      ? T
      : Id<OmitRecursively<T, K>>
    : T
  : never;

export type OmitRecursively<T extends BasicObject, K extends keyof T> = Omit<
  { [P in keyof T]: OmitDistributive<T[P], K> },
  K
>;

type PartialDistributive<
  T extends BasicObject,
  K extends keyof T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = T extends any
  ? T extends object
    ? T extends Date | ObjectId
      ? T
      : Id<OmitRecursively<T, K>>
    : T
  : never;

export type PartialByRecursively<
  T extends BasicObject,
  K extends keyof T,
> = PartialBy<{ [P in keyof T]: PartialDistributive<T[P], K> }, K>;
