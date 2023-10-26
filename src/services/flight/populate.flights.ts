import moment from 'moment';
import { isEmpty } from 'lodash';
import { Prisma } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { Sentry } from '@app/lib/sentry';
import { FlightQueryParam } from '@app/types/flight';
import { Flightera } from '@app/flight.vendors/flightera';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';

import { getFlightsPayloadFromFlightStats } from './flights.payload.from.flights.stat';
import { getFlightsPayloadFromAeroDataBox } from './flights.payload.from.aero.data.box';

/**
 * The function `getFlights` determines whether to retrieve flight data from FlightStats or AeroDataBox
 * based on the time difference between the search date and the current date.
 * @param {FlightQueryParam} params - The `params` parameter is an object that contains the following
 * properties:
 * @returns The function `getFlights` returns the result of either
 * `getFlightsPayloadFromFlightStats(params)` or `getFlightsPayloadFromAeroDataBox(params)` depending
 * on the condition `searchDate.diff(new Date(), 'days') <= 2`. If the condition is true, the result of
 * `getFlightsPayloadFromFlightStats(params)` is returned. Otherwise, the result of
 */
function getFlights(params: FlightQueryParam) {
  const searchDate = moment({
    date: params.flightDate,
    month: params.flightMonth,
    year: params.flightYear,
  });

  try {
    return searchDate.diff(new Date(), 'days') <= 2
      ? getFlightsPayloadFromFlightStats(params)
      : getFlightsPayloadFromAeroDataBox(params);
  } catch (error) {
    Sentry.captureException(error);
    return getFlightsPayloadFromAeroDataBox(params);
  }
}

/**
 * The function `patchFlightsWithFlightera` retrieves flight details from Flightera and updates the co2
 * emission and total distance properties of the flights.
 * @param {FlightQueryParam} params - The `params` parameter is an object that contains the following
 * properties:
 * @param {Prisma.FlightCreateInput[]} flights - An array of flight objects that need to be patched
 * with data from Flightera.
 * @returns The function `patchFlightsWithFlightera` returns a Promise that resolves to an array of
 * `Prisma.FlightCreateInput` objects.
 */
async function patchFlightsWithFlightera(
  params: FlightQueryParam,
  flights: Prisma.FlightCreateInput[],
): Promise<Prisma.FlightCreateInput[]> {
  try {
    const flighteraFlight = await Flightera.getFlightFromCrawl({
      airlineIata: params.airlineIata,
      flightNumber: params.flightNumber,
    });

    return flights.map(flight => ({
      ...flight,
      co2EmissionKgBusiness: flighteraFlight.co2EmissionKg.Business,
      co2EmissionKgEco: flighteraFlight.co2EmissionKg['Eco+'],
      co2EmissionKgEconomy: flighteraFlight.co2EmissionKg.Economy,
      co2EmissionKgFirst: flighteraFlight.co2EmissionKg.First,
      totalDistanceKm: flighteraFlight.distanceKm || flight.totalDistanceKm,
    }));
  } catch (error) {
    Logger.error('Unable to get flight details from Flightera', error);
    Sentry.captureException(error);
    return flights;
  }
}

/**
 * The `populateFlights` function populates flight data based on the provided parameters and creates
 * flight records in the database.
 */
export async function populateFlights(params: FlightQueryParam) {
  const initialPayload = await getFlights(params);
  const flights = await patchFlightsWithFlightera(params, initialPayload);

  if (isEmpty(flights)) {
    throw new Error('Flight(s) not found!');
  }

  try {
    Logger.debug('Creating flights for param[%o]', params);

    const result = await prisma.$transaction(
      flights.map(entry =>
        prisma.flight.create({
          data: entry,
          select: {
            id: true,
          },
        }),
      ),
    );

    Logger.warn(
      'Created %d for Flight[%s%s] on %s/%s/%s',
      result.length,
      params.airlineIata,
      params.flightNumber,
      params.flightYear,
      params.flightMonth,
      params.flightDate,
    );

    TopicPublisher.broadcastAll(
      result.map(flight => new FlightCreatedTopic(flight.id)),
    );
  } catch (error) {
    Logger.error('Unable to create flight(s) in populateFlights', error);
    throw new Error('Unable to create flight(s)');
  }
}
