import moment from 'moment';
import { isNil } from 'lodash';

import { prisma } from '@app/prisma';

export async function hasSubmittedFeedbackRecently(userID: string) {
  const exists = await prisma.feedback.findFirst({
    where: {
      createdAt: {
        gte: moment().subtract(24, 'hours').toDate(),
      },
      userID,
    },
  });

  return isNil(exists);
}
