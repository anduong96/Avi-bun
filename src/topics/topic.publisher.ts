import { Class } from '@app/types/class';
import { Logger } from '@app/lib/logger';
import { Singleton } from '@app/lib/singleton';
import { Topic } from './topic';
import { TopicListener } from './types';
import { noop } from 'lodash';

export class _TopicPublisher extends Singleton<_TopicPublisher>() {
  private readonly logger = Logger;
  private readonly listeners: Map<string, Map<Symbol, TopicListener>> =
    new Map();

  private getTopicMap(topicKey: string) {
    if (!this.listeners.has(topicKey)) {
      this.listeners.set(topicKey, new Map());
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
    const ID = Symbol();
    const topicMap = this.getTopicMap(topic.name);
    topicMap.set(ID, onTopic as TopicListener);

    const logger = this.logger;
    logger.debug('Added listener to topic', topic.name, ID);

    return function unsubscribe() {
      topicMap.delete(ID);
      logger.debug('Removed listener to topic', topic.name, ID);
    };
  }

  /**
   * The function broadcasts a topic to all listeners by iterating through the topic map and invoking
   * each listener with the topic.
   * @param {Topic} topic - The parameter "topic" is an object of type "Topic".
   */
  broadcast(topic: Topic) {
    this.logger.debug(`Broadcasting topic[${topic.key}]`);
    const topicMap = this.getTopicMap(topic.key);
    for (const listener of topicMap.values()) {
      listener(topic)?.catch(noop);
    }
  }
}

export const TopicPublisher = _TopicPublisher.instance;
