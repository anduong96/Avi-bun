import moment from 'moment';

import { prisma } from '@app/prisma';

export async function getRecentFeedback(userID: string) {
  const exists = await prisma.feedback.findFirst({
    where: {
      createdAt: {
        gte: moment().subtract(24, 'hours').toDate(),
      },
      userID,
    },
  });

  return exists;
}
