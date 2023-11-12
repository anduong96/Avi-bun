import moment from 'moment';
import { isEmpty } from 'lodash';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { Sentry } from '@app/lib/sentry';
import { FlightQueryParam } from '@app/types/flight';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';

import { getFlightEmissions } from './get.flight.emissions';
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
 * The `populateFlights` function populates flight data based on the provided parameters and creates
 * flight records in the database.
 */
export async function populateFlights(params: FlightQueryParam) {
  const [flights, emissions] = await Promise.all([
    getFlights(params),
    getFlightEmissions(params),
  ]);

  if (isEmpty(flights)) {
    throw new Error('Flight(s) not found!');
  }

  try {
    Logger.debug('Creating flights for param[%o]', params);
    const data = flights.map(flight => Object.assign(flight, emissions));
    // create many is having issue with validation
    const result = await prisma.$transaction(
      data.map(entry =>
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
      flights.map(flight => new FlightCreatedTopic(flight.id!)),
    );
  } catch (error) {
    Logger.error('Unable to create flight(s) in populateFlights', error);
    throw new Error('Unable to create flight(s)');
  }
}
