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

  broadcast(topic: Topic) {
    this.logger.debug('Broadcasting topic[%s]', topic.key);
    const topicMap = this.getTopicMap(topic.key);
    for (const listener of topicMap.values()) {
      listener(topic);
    }
  }
}

export const TopicPublisher = _TopicPublisher.instance;
