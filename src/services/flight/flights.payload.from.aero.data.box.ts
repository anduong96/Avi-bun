/* eslint-disable prettier/prettier */
import moment from 'moment-timezone';
import { FlightStatus, Prisma } from '@prisma/client';

import { createID } from '@app/lib/create.id';
import { FlightQueryParam } from '@app/types/flight';
import { AeroDataBox } from '@app/vendors/aircraft/aero.data.box';
import { AeroDataBoxFlight } from '@app/vendors/aircraft/aero.data.box/types';

function toFlightPayload(
  entry: AeroDataBoxFlight,
): RequiredKeys<Prisma.FlightUncheckedCreateInput, 'id'> {
  const departureDate = moment.parseZone(
    entry.departure.actualTimeLocal ?? entry.departure.scheduledTime.local,
  );
  const arrivalDate = moment.parseZone(
    entry.arrival.actualTimeLocal ?? entry.arrival.scheduledTime.local,
  );

  return {
    aircraftTailNumber: entry.aircraft.reg,
    airlineIata: entry.airline.iata,
    destinationBaggageClaim: entry.arrival.baggageBelt,
    destinationIata: entry.arrival.airport.iata,
    destinationTerminal: entry.arrival.terminal,
    destinationUtcHourOffset: arrivalDate.utcOffset() / 60,
    estimatedGateArrival: arrivalDate.toDate(),
    estimatedGateDeparture: departureDate.toDate(),
    flightDate: departureDate.date(),
    flightMonth: departureDate.month(),
    flightNumber: entry.number.replace(entry.airline.iata, '').trim(),
    flightYear: departureDate.year(),
    id: createID(),
    originIata: entry.departure.airport.iata,
    originTerminal: entry.departure.terminal,
    originUtcHourOffset: departureDate.utcOffset() / 60,
    scheduledGateArrival: arrivalDate.toDate(),
    scheduledGateDeparture: departureDate.toDate(),
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
