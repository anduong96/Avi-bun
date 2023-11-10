type ObjectPaths<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object ? `${K}.${ObjectPaths<T[K]>}` : K;
    }[keyof T] &
      string
  : never;
