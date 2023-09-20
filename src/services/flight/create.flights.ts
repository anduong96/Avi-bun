import { FlightStatus, FlightVendor, Prisma } from '@prisma/client';

import { AeroDataBox } from '@app/flight.vendors/aero.data.box';
import { FlightQueryParam } from '@app/types/flight';
import { Logger } from '../logger';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { prisma } from '@app/prisma';

export async function createFlights(params: FlightQueryParam): Promise<number> {
  const remoteFlights = await AeroDataBox.getFlights(params);
  if (isEmpty(remoteFlights)) {
    throw new Error('No flight(s) found');
  }

  //TODO: patch with flight stats
  const payload: Prisma.FlightCreateManyInput[] = remoteFlights.map(entry => ({
    airlineIata: entry.airline.iata,
    flightNumber: entry.number.replace(/ /g, ''),
    aircraftTailnumber: entry.aircraft.reg,
    originIata: entry.departure.airport.iata,
    originTerminal: entry.departure.terminal,
    destinationIata: entry.arrival.airport.iata,
    destinationBaggageClaim: entry.arrival.baggageBelt,
    destinationTerminal: entry.arrival.terminal,
    totalDistanceKm: entry.greatCircleDistance.km,
    vendor: FlightVendor.AERO_DATA_BOX,
    departureDate: moment(entry.departure.scheduledTimeUtc).toDate(),
    scheduledGateDeparture: moment(entry.departure.scheduledTimeUtc).toDate(),
    estimatedGateDeparture: moment(entry.departure.scheduledTimeUtc).toDate(),
    scheduledGateArrival: moment(entry.arrival.scheduledTimeUtc).toDate(),
    estimatedGateArrival: moment(entry.arrival.scheduledTimeUtc).toDate(),
    status:
      entry.status === 'Arrived'
        ? FlightStatus.ARRIVED
        : entry.status === 'Departed'
        ? FlightStatus.DEPARTED
        : FlightStatus.SCHEDULED,
  }));

  const result = await prisma.flight.createMany({
    data: payload,
    skipDuplicates: true,
  });

  Logger.warn(
    'Created %d for Flight[%s%s] on %s',
    result.count,
    params.airlineIata,
    params.airlineIata,
    params.departureDate.toISOString(),
  );

  return result.count;
}