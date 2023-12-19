import { FeedbackType } from '@prisma/client';
import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';

import { prisma } from '@app/prisma';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { GQL_Feedback } from '@app/@generated/graphql/models/Feedback';
import { GQL_FeedbackType } from '@app/@generated/graphql/enums/FeedbackType';
import { FeedbackCreatedTopic } from '@app/topics/defined.topics/feedback.created.topic';
import { hasSubmittedFeedbackRecently } from '@app/services/feedback/has.submitted.feedback.recently';

import { CurrentUserID } from '../_decorators/current.user.id.decorator';

@Resolver(() => GQL_Feedback)
export class FeedbackResolver {
  @Authorized()
  @Mutation(() => String)
  async submitFeedback(
    @CurrentUserID() userID: string,
    @Arg('message') message: string,
    @Arg('rating') rating: number,
    @Arg('type', () => GQL_FeedbackType) type: FeedbackType,
  ) {
    const submittedRecently = await hasSubmittedFeedbackRecently(userID);
    if (submittedRecently) {
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
