import { prisma } from '@app/prisma';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { UserCreatedTopic } from '@app/topics/defined.topics/user.created.topic';

TopicPublisher.subscribe(UserCreatedTopic, async topic => {
  await prisma.userPreference.create({
    data: {
      userID: topic.userID,
    },
    select: {
      id: true,
    },
  });
});
