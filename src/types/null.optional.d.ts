type NullOptional<T> = {
  [K in keyof T]: T[K] extends null ? T[K] | undefined : T[K];
};
