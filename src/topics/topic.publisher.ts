import { noop } from 'lodash';

import { Class } from '@app/types/class';
import { Singleton } from '@app/lib/singleton';

import { Topic } from './topic';
import { TopicListener } from './types';

export class _TopicPublisher extends Singleton<_TopicPublisher>() {
  private readonly listeners: Map<string, TopicListener[]> = new Map();

  private getTopicListeners(topicKey: string) {
    if (!this.listeners.has(topicKey)) {
      this.listeners.set(topicKey, []);
    }

    return this.listeners.get(topicKey)!;
  }

  /**
   * The function broadcasts a topic asynchronously and catches any errors.
   * @param {Topic} topic - The "topic" parameter is an object representing the topic of the broadcast.
   * It could contain information such as the title, description, or any other relevant details about the
   * topic being broadcasted.
   */
  broadcast(topic: Topic) {
    this.broadcastAsync(topic).catch(noop);
  }

  /**
   * The function `broadcastAll` broadcasts messages for multiple topics.
   * @param {T[]} topic - The `topic` parameter is an array of elements of type `T`, where `T` extends
   * the `Topic` type.
   */
  broadcastAll<T extends Topic>(topic: T[]) {
    for (const t of topic) {
      this.broadcast(t);
    }
  }

  /**
   * The `broadcastAsync` function broadcasts a given topic to all listeners asynchronously.
   * @param {Topic} topic - The `topic` parameter is an object representing a topic. It likely has a
   * `key` property that identifies the topic.
   */
  async broadcastAsync(topic: Topic) {
    this.logger.debug(`Broadcasting topic[${topic.key}]`);
    const listeners = this.getTopicListeners(topic.key);
    for (const listener of listeners) {
      await listener(topic)?.catch(noop);
    }
  }

  /**
   * The `subscribe` function allows you to subscribe to a specific topic and receive notifications
   * when that topic is triggered.
   * @param {A} topic - The `topic` parameter is a generic type `A` that extends the `Class` type,
   * representing the topic to subscribe to.
   * @param onTopic - The `onTopic` parameter is a callback function that will be invoked when a new
   * message is published on the specified topic. The callback function will receive the message as its
   * argument.
   * @returns The function `unsubscribe` is being returned.
   */
  subscribe<A extends Class<Topic>>(
    topic: A,
    onTopic: TopicListener<InstanceType<A>>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const listeners = this.getTopicListeners(topic.name);
    const listener = onTopic as TopicListener;
    listeners.push(listener);

    this.logger.debug('Added listener to topic', topic.name);

    return function unsubscribe() {
      const index = self.getTopicListeners(topic.name).indexOf(listener);
      listeners.splice(index, 1);
      self.logger.debug('Removed listener to topic', topic.name);
    };
  }
}

export const TopicPublisher = _TopicPublisher.instance;
