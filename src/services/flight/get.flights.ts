import { isEmpty } from 'lodash';
import { Flight } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { FlightQueryParam } from '@app/types/flight';

import { populateFlights } from './populate.flights';

/**
 * The function `getFlights` retrieves flights based on the provided parameters and throws an error if
 * no flights are found and `throwIfNotFound` is set to true.
 * @param {FlightQueryParam} param - The `param` parameter is an object that contains the following
 * properties:
 * @param [throwIfNotFound=false] - The `throwIfNotFound` parameter is a boolean flag that determines
 * whether an error should be thrown if no flights are found for the given query parameters. If
 * `throwIfNotFound` is set to `true`, an error will be thrown with the message "Flight(s) not found!"
 * when no flights
 * @returns a Promise that resolves to an array of Flight objects.
 */
export async function getFlights(
  param: FlightQueryParam,
  throwIfNotFound = false,
): Promise<Flight[]> {
  const flights = await prisma.flight.findMany({
    orderBy: {
      scheduledGateDeparture: 'asc',
    },
    where: {
      airlineIata: param.airlineIata,
      flightDate: param.flightDate,
      flightMonth: param.flightMonth,
      flightNumber: param.flightNumber,
      flightYear: param.flightYear,
    },
  });

  if (!isEmpty(flights)) {
    Logger.debug('%s Flights found for param[%o]', flights.length, param);
    return flights;
  } else if (isEmpty(flights) && throwIfNotFound) {
    Logger.error('No flights found! param=%o', param);
    throw new Error('Flight(s) not found!');
  }

  await populateFlights(param);

  return getFlights(param, true);
}
