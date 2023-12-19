import { Feedback } from '@prisma/client';

import { Topic } from '../topic';

export class FeedbackCreatedTopic extends Topic {
  constructor(readonly feedbackID: Feedback['id']) {
    super();
  }
}
