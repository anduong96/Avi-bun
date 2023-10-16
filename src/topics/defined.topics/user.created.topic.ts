import { User } from '@prisma/client';

import { Topic } from '../topic';

export class UserCreatedTopic extends Topic {
  constructor(readonly userID: User['id']) {
    super();
  }
}
