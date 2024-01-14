import { Scheduler } from '@app/scheduler';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { CreateAircraftJob } from '@app/scheduler/defined.jobs/aircraft.create.job';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';

TopicPublisher.subscribe(FlightCreatedTopic, async topic => {
  await Scheduler.schedule(new Date(), new CreateAircraftJob(topic.flightID));
});
