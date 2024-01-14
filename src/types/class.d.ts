import { ClassType } from 'type-graphql';

export type ClassType<T, C> = typeof T & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
  prototype: T;
};
