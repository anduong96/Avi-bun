export type RequiredAll<T> = {
  [K in keyof T]: Exclude<T[K], null | undefined>;
};
