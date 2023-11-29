import { Flight, User } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { createID } from '@app/lib/create.id';

export async function saveFlightToUser(
  flightID: Flight['id'],
  userID: User['id'],
) {
  Logger.debug('Adding flight[%s] to user[%s]', flightID, userID);

  const record = await prisma.userFlight.upsert({
    create: {
      flightID,
      id: createID(),
      userID,
    },
    update: {},
    where: {
      flightID_userID: {
        flightID,
        userID,
      },
    },
  });

  return record;
}
