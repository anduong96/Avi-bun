import { Singleton } from '@app/lib/singleton';
import { Class } from '@app/types/class';
import { noop } from 'lodash';
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

  /**
   * The function broadcasts a topic to all listeners by iterating through the topic map and invoking
   * each listener with the topic.
   * @param {Topic} topic - The parameter "topic" is an object of type "Topic".
   */
  broadcast(topic: Topic) {
    this.logger.debug(`Broadcasting topic[${topic.key}]`);
    const listeners = this.getTopicListeners(topic.key);
    for (const listener of listeners) {
      listener(topic)?.catch(noop);
    }
  }
}

export const TopicPublisher = _TopicPublisher.instance;
