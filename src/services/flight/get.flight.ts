import { Logger } from '@app/lib/logger';
import { prisma } from '@app/prisma';
import { FlightQueryParam } from '@app/types/flight';
import { Flight } from '@prisma/client';
import { isEmpty } from 'lodash';
import { createFlightsFromAeroDataBox } from './create.flights.from.aero';
import moment from 'moment';
import { createFlightFromFlightStats } from './create.flights.from.flight.stats';

export async function getFlights(
  param: FlightQueryParam,
  throwIfNotFound = false,
): Promise<Flight[]> {
  const flights = await prisma.flight.findMany({
    where: {
      airlineIata: param.airlineIata,
      flightNumber: param.flightNumber,
      flightYear: param.flightYear,
      flightMonth: param.flightMonth,
      flightDate: param.flightDate,
    },
    orderBy: {
      scheduledGateDeparture: 'asc',
    },
  });

  if (!isEmpty(flights)) {
    Logger.debug('%s Flights found for param[%o]', flights.length, param);
    return flights;
  } else if (isEmpty(flights) && throwIfNotFound) {
    throw new Error('Flight(s) not found!');
  }

  Logger.warn('Flights not found, attempting creating flights', param);

  const today = moment();
  const searchDate = moment({
    year: param.flightYear,
    month: param.flightMonth,
    date: param.flightDate,
  });

  if (searchDate.isSame(today, 'day')) {
    await createFlightFromFlightStats(param);
  } else {
    await createFlightsFromAeroDataBox(param);
  }

  return getFlights(param, true);
}
