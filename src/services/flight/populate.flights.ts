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
    const now = moment();
    const searchDateDiff = Math.ceil(
      moment.duration(searchDate.diff(now)).asDays(),
    );
    const shouldGetFlightsFromFlightStats = searchDateDiff <= 2;
    Logger.debug(
      'Should get flights from flight stats=%s',
      shouldGetFlightsFromFlightStats,
      { searchDateDiff },
    );

    return shouldGetFlightsFromFlightStats
      ? getFlightsPayloadFromFlightStats(params)
      : getFlightsPayloadFromAeroDataBox(params);
  } catch (error) {
    Sentry.captureException(error, {
      contexts: {
        params,
      },
    });
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
    Logger.error('No flights found! %o', { params });
    throw new Error('Flight(s) not found!');
  }

  try {
    Logger.debug('Creating flights for param[%o]', params);
    const data = flights.map(flight => Object.assign(flight, emissions));
    const result = await prisma.$transaction(
      data.map(entry => {
        Logger.debug(
          'Creating id=%s flight=%s%s on date=%s-%s-%s',
          entry.id,
          entry.airlineIata,
          entry.flightNumber,
          entry.flightYear,
          entry.flightMonth,
          entry.flightDate,
        );

        return prisma.flight.upsert({
          create: entry,
          select: { id: true },
          update: { updatedAt: moment().toDate() },
          where: {
            airlineIata_flightNumber_originIata_destinationIata_flightYear_flightMonth_flightDate:
              {
                airlineIata: entry.airlineIata,
                destinationIata: entry.destinationIata,
                flightDate: entry.flightDate,
                flightMonth: entry.flightMonth,
                flightNumber: entry.flightNumber,
                flightYear: entry.flightYear,
                originIata: entry.originIata,
              },
          },
        });
      }),
    );

    Logger.warn(
      'Created %d for Flight[%s%s]',
      result.length,
      params.airlineIata,
      params.flightNumber,
    );

    TopicPublisher.broadcastAll(
      flights.map(flight => new FlightCreatedTopic(flight.id!)),
    );
  } catch (error) {
    Logger.error('Unable to create flight(s) in populateFlights', error);
    throw new Error('Unable to create flight(s)');
  }
}
