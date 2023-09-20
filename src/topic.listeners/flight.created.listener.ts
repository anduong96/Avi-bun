import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { createAircraft } from '@app/services/aircraft/create.aircraft';

TopicPublisher.subscribe(FlightCreatedTopic, async topic => {
  if (topic.flight.aircraftTailnumber) {
    await createAircraft(topic.flight.aircraftTailnumber);
  }
});
