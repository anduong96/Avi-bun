import { FlightStatus, Prisma } from '@prisma/client';

import { AeroDataBox } from '@app/lib/flight.vendors/aero.data.box';
import { prisma } from '@app/prisma';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { FlightQueryParam } from '@app/types/flight';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { tryNice } from 'try-nice';
import { Logger } from '../../lib/logger';
import {
  toOriginDepartureDAteFromObj,
  toOriginDepartureDate,
} from './origin.departure.date';

export async function createFlightsFromAeroDataBox(params: FlightQueryParam) {
  const remoteFlights = await AeroDataBox.getFlights(params);

  if (isEmpty(remoteFlights)) {
    throw new Error('No flight(s) found');
  }

  Logger.debug('AeroDataBox.getFlights', remoteFlights);

  const payload = await Promise.all(
    remoteFlights.map(
      async (entry): Promise<Prisma.FlightUncheckedCreateInput> => ({
        airlineIata: entry.airline.iata,
        flightNumber: entry.number.replace(entry.airline.iata, '').trim(),
        aircraftTailnumber: entry.aircraft.reg,
        originIata: entry.departure.airport.iata,
        originTerminal: entry.departure.terminal,
        destinationIata: entry.arrival.airport.iata,
        destinationBaggageClaim: entry.arrival.baggageBelt,
        destinationTerminal: entry.arrival.terminal,
        totalDistanceKm: entry.greatCircleDistance.km,
        originDepartureDate: await toOriginDepartureDate(
          entry.departure.scheduledTimeUtc,
          entry.departure.airport.iata,
        ),
        scheduledGateDeparture: moment(
          entry.departure.scheduledTimeUtc,
        ).toDate(),
        estimatedGateDeparture: moment(
          entry.departure.scheduledTimeUtc,
        ).toDate(),
        scheduledGateArrival: moment(entry.arrival.scheduledTimeUtc).toDate(),
        estimatedGateArrival: moment(entry.arrival.scheduledTimeUtc).toDate(),
        status:
          entry.status === 'Arrived'
            ? FlightStatus.ARRIVED
            : entry.status === 'Departed'
            ? FlightStatus.DEPARTED
            : FlightStatus.SCHEDULED,
      }),
    ),
  );

  const [result, error] = await tryNice(() =>
    prisma.$transaction(
      payload.map(data =>
        prisma.flight.create({
          data,
        }),
      ),
    ),
  );

  if (!result) {
    Logger.error('Unable to create flights', error);
    throw new Error('Unable to create flights');
  }

  for (const flight of result) {
    TopicPublisher.broadcast(new FlightCreatedTopic(flight));
  }

  Logger.warn(
    'Created %d for Flight[%s%s] on %s',
    result.length,
    params.airlineIata,
    params.flightNumber,
    toOriginDepartureDAteFromObj(params.departureDate),
  );

  return result;
}
