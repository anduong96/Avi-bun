import moment from 'moment';
import * as uuid from 'uuid';
import { FlightStatus, Prisma } from '@prisma/client';

import { toDateOrNull } from '@app/lib/date.or.null';
import { FlightQueryParam } from '@app/types/flight';
import { AeroDataBox } from '@app/flight.vendors/aero.data.box';
import { AeroDataBoxFlight } from '@app/flight.vendors/aero.data.box/types';

function toFlightPayload(entry: AeroDataBoxFlight): Prisma.FlightCreateInput {
  const departureDate = moment(
    entry.departure.scheduledTimeLocal,
    'YYYY-MM-DD',
  );

  return {
    Airline: {
      connect: {
        iata: entry.airline.iata,
      },
    },
    Destination: {
      connect: {
        iata: entry.arrival.airport.iata,
      },
    },
    Origin: {
      connect: {
        iata: entry.departure.airport.iata,
      },
    },
    aircraftTailNumber: entry.aircraft.reg,
    destinationBaggageClaim: entry.arrival.baggageBelt,
    destinationTerminal: entry.arrival.terminal,
    estimatedGateArrival: toDateOrNull(entry.arrival.scheduledTimeUtc)!,
    estimatedGateDeparture: toDateOrNull(entry.departure.scheduledTimeUtc)!,
    flightDate: departureDate.date(),
    flightMonth: departureDate.month(),
    flightNumber: entry.number.replace(entry.airline.iata, '').trim(),
    flightYear: departureDate.year(),
    id: uuid.v4(),
    originTerminal: entry.departure.terminal,
    scheduledGateArrival: toDateOrNull(entry.arrival.scheduledTimeUtc)!,
    scheduledGateDeparture: toDateOrNull(entry.departure.scheduledTimeUtc)!,
    status:
      entry.status === 'Arrived'
        ? FlightStatus.ARRIVED
        : entry.status === 'Departed'
        ? FlightStatus.DEPARTED
        : FlightStatus.SCHEDULED,
    totalDistanceKm: entry.greatCircleDistance.km,
  };
}

export async function getFlightsPayloadFromAeroDataBox(
  params: FlightQueryParam,
) {
  const remoteFlights = await AeroDataBox.getFlights(params);
  return remoteFlights.map(toFlightPayload);
}
