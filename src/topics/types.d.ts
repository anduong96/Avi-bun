import { Topic } from './topic';

export type TopicListener<T extends Topic = unknown> = (
  topic: T,
) => Promise<void> | void;
