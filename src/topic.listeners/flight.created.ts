import { Scheduler } from '@app/scheduler';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { CreateAircraftJob } from '@app/scheduler/defined.jobs/aircraft.create.job';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';
import { CreateAircraftMetaJob } from '@app/scheduler/defined.jobs/aircraft.meta.create.job';

TopicPublisher.subscribe(FlightCreatedTopic, async topic => {
  await Scheduler.scheduleMany([
    {
      job: new CreateAircraftJob(topic.flightID),
      time: new Date(),
    },
    {
      job: new CreateAircraftMetaJob({ flightID: topic.flightID }),
      time: new Date(),
    },
  ]);
});
