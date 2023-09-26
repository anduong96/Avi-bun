import { toDateOrNull } from '@app/lib/date.or.null';
import { AeroDataBox } from '@app/lib/flight.vendors/aero.data.box';
import { AeroDataBoxFlight } from '@app/lib/flight.vendors/aero.data.box/types';
import { FlightQueryParam } from '@app/types/flight';
import { FlightStatus, Prisma } from '@prisma/client';
import moment from 'moment';
import * as uuid from 'uuid';

function toFlightPayload(
  entry: AeroDataBoxFlight,
): Prisma.FlightUncheckedCreateInput {
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
    scheduledGateArrival: toDateOrNull(entry.arrival.scheduledTimeUtc)!,
    estimatedGateArrival: toDateOrNull(entry.arrival.scheduledTimeUtc)!,
    status:
      entry.status === 'Arrived'
        ? FlightStatus.ARRIVED
        : entry.status === 'Departed'
        ? FlightStatus.DEPARTED
        : FlightStatus.SCHEDULED,
  };
}

export async function getFlightsPayloadFromAeroDataBox(
  params: FlightQueryParam,
) {
  const remoteFlights = await AeroDataBox.getFlights(params);
  return remoteFlights.map(toFlightPayload);
}
