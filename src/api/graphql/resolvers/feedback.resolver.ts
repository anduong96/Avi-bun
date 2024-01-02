import { FeedbackType } from '@prisma/client';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';

import { prisma } from '@app/prisma';
// import { assertAuth } from '@app/services/user/has.auth';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { GQL_Feedback } from '@app/@generated/graphql/models/Feedback';
import { GQL_FeedbackType } from '@app/@generated/graphql/enums/FeedbackType';
import { getRecentFeedback } from '@app/services/feedback/get.recent.feedback';
import { FeedbackCreatedTopic } from '@app/topics/defined.topics/feedback.created.topic';

import { CurrentUserID } from '../_decorators/current.user.id.decorator';

@Resolver(() => GQL_Feedback)
export class FeedbackResolver {
  @Authorized()
  @Query(() => GQL_Feedback, { nullable: true })
  async recentFeedback(@CurrentUserID() userID: string) {
    const feedback = await getRecentFeedback(userID);
    return feedback;
  }

  @Authorized()
  @Mutation(() => String)
  async submitFeedback(
    @CurrentUserID() userID: string,
    @Arg('message') message: string,
    @Arg('rating') rating: number,
    @Arg('type', () => GQL_FeedbackType) type: FeedbackType,
  ) {
    // await assertAuth(userID, 'User is not authenticated');
    const exists = await getRecentFeedback(userID);
    if (exists) {
      throw new Error('You have already recently submitted feedback');
    }

    const entry = await prisma.feedback.create({
      data: {
        message,
        rating,
        type,
        userID,
      },
      select: {
        id: true,
      },
    });

    TopicPublisher.broadcast(new FeedbackCreatedTopic(entry.id));
    return entry;
  }
}
