import { TopicPublisher } from '@app/topics/topic.publisher';
import { getOrCreateAircraft } from '@app/services/aircraft/get.or.create.aircraft';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';

TopicPublisher.subscribe(FlightCreatedTopic, async topic => {
  if (topic.flight.aircraftTailNumber) {
    await getOrCreateAircraft(topic.flight.aircraftTailNumber);
  }
});
