import { FlightStatus, User } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';

export async function getUserActiveFlights(userID: User['id']) {
  Logger.debug('Getting user=%s active flights', userID);
  const flights = await prisma.userFlight.findMany({
    orderBy: {
      Flight: {
        estimatedGateDeparture: 'asc',
      },
    },
    where: {
      Flight: {
        isArchived: false,
        status: {
          notIn: [FlightStatus.ARCHIVED],
        },
      },
      userID,
    },
  });

  Logger.debug('Got user=%s active flights=%s', userID, flights.length);
  return flights;
}
