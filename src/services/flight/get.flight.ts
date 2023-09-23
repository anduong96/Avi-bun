import { Logger } from '@app/lib/logger';
import { prisma } from '@app/prisma';
import { FlightQueryParam } from '@app/types/flight';
import { Flight } from '@prisma/client';
import { isEmpty } from 'lodash';
import { createFlightsFromAeroDataBox } from './create.flights.from.aero';
import moment from 'moment';
import { createFlightFromFlightStats } from './create.flights.from.flight.stats';

export async function getFlights(param: FlightQueryParam): Promise<Flight[]> {
  const flights = await prisma.flight.findMany({
    where: {
      airlineIata: param.airlineIata,
      flightNumber: param.flightNumber,
      departureDate: param.departureDate,
    },
  });

  const isRequestingToday = moment().isSame(param.departureDate, 'day');

  if (!isEmpty(flights)) {
    return flights;
  }

  Logger.warn('Flights not found, attempting creating flights', param);

  if (isRequestingToday) {
    return createFlightFromFlightStats(param);
  }

  return createFlightsFromAeroDataBox(param);
}
