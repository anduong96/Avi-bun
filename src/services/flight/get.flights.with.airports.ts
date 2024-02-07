import { isEmpty } from 'lodash';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { FlightQueryAirportsParams } from '@app/types/flight';

import { populateFlightsWithAirports } from './populate.flights.with.airports';

export async function getFlightsFromAirports(
  params: FlightQueryAirportsParams,
  throwIfNotFound = false,
) {
  const flights = await prisma.flight.findMany({
    orderBy: {
      scheduledGateDeparture: 'asc',
    },
    where: {
      airlineIata: params.airlineIata,
      destinationIata: params.destinationIata,
      flightDate: params.flightDate,
      flightMonth: params.flightMonth,
      flightYear: params.flightYear,
      originIata: params.originIata,
    },
  });

  if (!isEmpty(flights)) {
    Logger.debug('%s Flights found for param[%o]', flights.length, params);
    return flights;
  } else if (isEmpty(flights) && throwIfNotFound) {
    Logger.error('No flights found! param=%o', params);
    throw new Error('Flight(s) not found!');
  }

  await populateFlightsWithAirports(params);

  return getFlightsFromAirports(params, true);
}
