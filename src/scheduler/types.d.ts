import { Job } from './job';

export type JobType<Arguments extends unknown[] = never> = Pick<
  typeof Job,
  'clone'
> & {
  new (...args: Arguments): InstanceType<typeof Job>;
};
