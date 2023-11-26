import { FlightStatus, User } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';

export async function getUserArchivedFlights(userID: User['id']) {
  Logger.debug('Getting user=%s archived flights', userID);
  const flights = await prisma.userFlight.findMany({
    orderBy: {
      Flight: {
        estimatedGateDeparture: 'desc',
      },
    },
    where: {
      Flight: {
        status: {
          in: [FlightStatus.ARCHIVED, FlightStatus.CANCELED],
        },
      },
      userID,
    },
  });

  Logger.debug('Got user=%s archived flights=%s', userID, flights.length);
  return flights;
}
