import { Logger } from '@app/services/logger';
import { Singleton } from '@app/lib/singleton';
import { Topic } from './topic';
import { TopicListener } from './types';

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
   * The `subscribe` function adds a listener to a specific topic and returns a function to unsubscribe
   * the listener.
   * @param topic - The `topic` parameter is the type of the topic that the listener wants to subscribe
   * to. It is of type `Topic`.
   * @param {TopicListener} onTopic - The `onTopic` parameter is a callback function that will be
   * invoked whenever a new message is published on the specified topic.
   * @returns The function `unsubscribe` is being returned.
   */
  subscribe(topic: typeof Topic, onTopic: TopicListener) {
    const ID = Symbol();
    const topicMap = this.getTopicMap(topic.name);
    topicMap.set(ID, onTopic);

    const logger = this.logger;
    logger.debug('Added listener to topic[%s] ID[%s]', topic.name, ID);

    return function unsubscribe() {
      topicMap.delete(ID);
      logger.debug('Removed listener to topic[%s] ID[%s]', topic.name, ID);
    };
  }

  /**
   * The function broadcasts a topic to all listeners by iterating through the topic map and invoking
   * each listener with the topic.
   * @param {Topic} topic - The parameter "topic" is an object of type "Topic".
   */
  broadcast(topic: Topic) {
    this.logger.debug('Broadcasting topic[%s]', topic.key);
    const topicMap = this.getTopicMap(topic.key);
    for (const listener of topicMap.values()) {
      listener(topic);
    }
  }
}

export const TopicPublisher = _TopicPublisher.instance;
