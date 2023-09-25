import { Flight, FlightStatus, Prisma } from '@prisma/client';

import { toDateOrNull } from '@app/lib/date.or.null';
import { AeroDataBox } from '@app/lib/flight.vendors/aero.data.box';
import { prisma } from '@app/prisma';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { FlightQueryParam } from '@app/types/flight';
import { isEmpty } from 'lodash';
import moment from 'moment';
import * as uuid from 'uuid';
import { Logger } from '../../lib/logger';

export async function createFlightsFromAeroDataBox(params: FlightQueryParam) {
  const remoteFlights = await AeroDataBox.getFlights(params);
  Logger.debug('AeroDataBox.getFlights params: [%o]\n', params, remoteFlights);

  if (isEmpty(remoteFlights)) {
    throw new Error('No flight(s) found');
  }

  const flights = remoteFlights.map(
    (entry): Prisma.FlightUncheckedCreateInput => {
      const departureDate = moment(
        entry.departure.scheduledTimeLocal,
        'YYYY-MM-DD',
      );

      return {
        id: uuid.v4(),
        airlineIata: entry.airline.iata,
        flightNumber: entry.number.replace(entry.airline.iata, '').trim(),
        aircraftTailnumber: entry.aircraft.reg,
        originIata: entry.departure.airport.iata,
        originTerminal: entry.departure.terminal,
        destinationIata: entry.arrival.airport.iata,
        destinationBaggageClaim: entry.arrival.baggageBelt,
        destinationTerminal: entry.arrival.terminal,
        totalDistanceKm: entry.greatCircleDistance.km,
        flightYear: departureDate.year(),
        flightMonth: departureDate.month(),
        flightDate: departureDate.date(),
        scheduledGateDeparture: toDateOrNull(entry.departure.scheduledTimeUtc)!,
        estimatedGateDeparture: toDateOrNull(entry.departure.scheduledTimeUtc)!,
        scheduledGateArrival: moment(entry.arrival.scheduledTimeUtc).toDate(),
        estimatedGateArrival: moment(entry.arrival.scheduledTimeUtc).toDate(),
        status:
          entry.status === 'Arrived'
            ? FlightStatus.ARRIVED
            : entry.status === 'Departed'
            ? FlightStatus.DEPARTED
            : FlightStatus.SCHEDULED,
      };
    },
  );

  try {
    const result = await prisma.$transaction(
      flights.map(flight =>
        prisma.flight.create({
          data: flight,
        }),
      ),
    );

    Logger.warn(
      'Created %d for Flight[%s%s] on %s-%s-%s',
      result.length,
      params.airlineIata,
      params.flightNumber,
      params.flightYear,
      params.flightMonth,
      params.flightDate,
    );

    TopicPublisher.broadcastAll(
      flights.map(flight => new FlightCreatedTopic(flight as Flight)),
    );

    return flights;
  } catch (error) {
    Logger.error('Unable to create flights', error);
    throw new Error('Unable to create flights');
  }
}
