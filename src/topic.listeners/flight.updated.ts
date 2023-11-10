import { TopicPublisher } from '@app/topics/topic.publisher';
import { handleFlightChangesForAlert } from '@app/services/alerts/alert.engine';
import { FlightUpdatedTopic } from '@app/topics/defined.topics/flight.updated.topic';

TopicPublisher.subscribe(FlightUpdatedTopic, topic =>
  handleFlightChangesForAlert(topic.previous, topic.current),
);
