import { noop } from 'lodash';
import { describe, expect, mock, test } from 'bun:test';

import { Topic } from '../topic';
import { TopicPublisher } from '../topic.publisher';

class MockTopic extends Topic {}
class MockTopicv2 extends Topic {}

describe('Topic', () => {
  test('broacast topic', () => {
    const topic = new MockTopic();

    const m1Listener = mock(() => noop());
    const m2Listener = mock(() => noop());

    TopicPublisher.subscribe(MockTopic, m1Listener);
    TopicPublisher.subscribe(MockTopicv2, m2Listener);
    TopicPublisher.broadcast(topic);

    expect(m1Listener).toHaveBeenCalled();
    expect(m1Listener).toHaveBeenCalledTimes(1);
    expect(m2Listener).not.toHaveBeenCalled();

    TopicPublisher.broadcast(topic);
    expect(m1Listener).toHaveBeenCalledTimes(2);
    expect(m2Listener).not.toHaveBeenCalled();
  });
});
