type RequiredKeys<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? Exclude<T[P], undefined> : T[P];
};
