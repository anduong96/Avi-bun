import { Topic } from './topic';

export type TopicListener<T extends Topic = unknown> = (
  topic: T,
) => void | Promise<void>;
