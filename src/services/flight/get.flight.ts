import { Flight } from '@prisma/client';
import { FlightQueryParam } from '@app/types/flight';
import { createFlights } from './create.flights';
import { isEmpty } from 'lodash';
import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';

export async function getFlights(
  param: FlightQueryParam,
  throwsIfEmpty?: boolean,
): Promise<Flight[]> {
  const flights = await prisma.flight.findMany({
    where: {
      airlineIata: param.airlineIata,
      flightNumber: param.flightNumber,
      departureDate: param.departureDate,
    },
  });

  if (isEmpty(flights) && throwsIfEmpty) {
    Logger.warn('No flights found from args', param);
    throw new Error('Flight(s) not found');
  } else if (isEmpty(flights)) {
    Logger.warn('Flights not found, attempting creating flights', param);
    await createFlights(param);
    return getFlights(param, true);
  }

  return flights;
}
