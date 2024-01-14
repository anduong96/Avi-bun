import { Scheduler } from '@app/scheduler';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { UserCreatedTopic } from '@app/topics/defined.topics/user.created.topic';
import { UserPreferenceCreateJob } from '@app/scheduler/defined.jobs/user.preference.create.job';

TopicPublisher.subscribe(UserCreatedTopic, async topic => {
  await Scheduler.schedule(
    new Date(),
    new UserPreferenceCreateJob({
      userID: topic.userID,
    }),
  );
});
