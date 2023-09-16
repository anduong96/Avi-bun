export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type OneOrMany<T> = T | Array<T>;

export type ArrayElement<T> = T extends (infer U)[] ? U : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BasicObject<T = any> = {
  [key: string]: T;
};

export type ValueOf<T> = T[keyof T];

export type Immutable<T extends object> = {
  readonly [P in keyof T]-?: T[P] extends object ? Immutable<T[P]> : T[P];
};

export type Mutable<T extends object> = {
  -readonly [P in keyof T]-?: T[P] extends object ? Mutable<T[P]> : T[P];
};
