import moment from 'moment';
import * as uuid from 'uuid';
import { FlightStatus, Prisma } from '@prisma/client';

import { toDateOrNull } from '@app/lib/date.or.null';
import { FlightQueryParam } from '@app/types/flight';
import { AeroDataBox } from '@app/flight.vendors/aero.data.box';
import { AeroDataBoxFlight } from '@app/flight.vendors/aero.data.box/types';

function toFlightPayload(
  entry: AeroDataBoxFlight,
): Prisma.FlightUncheckedCreateInput {
  const departureDate = moment(
    entry.departure.scheduledTimeLocal,
    'YYYY-MM-DD',
  );

  return {
    aircraftTailnumber: entry.aircraft.reg,
    airlineIata: entry.airline.iata,
    destinationBaggageClaim: entry.arrival.baggageBelt,
    destinationIata: entry.arrival.airport.iata,
    destinationTerminal: entry.arrival.terminal,
    estimatedGateArrival: toDateOrNull(entry.arrival.scheduledTimeUtc)!,
    estimatedGateDeparture: toDateOrNull(entry.departure.scheduledTimeUtc)!,
    flightDate: departureDate.date(),
    flightMonth: departureDate.month(),
    flightNumber: entry.number.replace(entry.airline.iata, '').trim(),
    flightYear: departureDate.year(),
    id: uuid.v4(),
    originIata: entry.departure.airport.iata,
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
