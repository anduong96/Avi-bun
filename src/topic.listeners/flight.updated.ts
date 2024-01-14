import { Scheduler } from '@app/scheduler';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { FlightUpdatedTopic } from '@app/topics/defined.topics/flight.updated.topic';
import { FlightAlertSyncJob } from '@app/scheduler/defined.jobs/flight.alert.sync.job';

TopicPublisher.subscribe(FlightUpdatedTopic, async topic => {
  await Scheduler.schedule(
    new Date(),
    new FlightAlertSyncJob({
      current: topic.current,
      previous: topic.previous,
    }),
  );
});
