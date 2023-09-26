import { FlightQueryParam } from '@app/types/flight';
import moment from 'moment';
import { getFlightsPayloadFromFlightStats } from './flights.payload.from.flights.stat';
import { getFlightsPayloadFromAeroDataBox } from './flights.payload.from.aero.data.box';
import { isEmpty } from 'lodash';
import { Logger } from '@app/lib/logger';
import { prisma } from '@app/prisma';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';
import { Flight } from '@prisma/client';

/**
 * The `populateFlights` function populates flight data based on the provided parameters and creates
 * flight records in the database.
 */
export async function populateFlights(params: FlightQueryParam) {
  const today = moment();
  const searchDate = moment({
    year: params.flightYear,
    month: params.flightMonth,
    date: params.flightDate,
  });

  const flights =
    searchDate.diff(today, 'days') > 2
      ? await getFlightsPayloadFromFlightStats(params)
      : await getFlightsPayloadFromAeroDataBox(params);

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
      flights.map(entry => new FlightCreatedTopic(entry as Flight)),
    );
  } catch (error) {
    Logger.error('Unable to create flight(s)', error);
    throw new Error('Unable to create flight(s)');
  }
}
