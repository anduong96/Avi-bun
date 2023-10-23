import * as uuid from 'uuid';
import moment from 'moment-timezone';
import { FlightStatus, Prisma } from '@prisma/client';

import { FlightQueryParam } from '@app/types/flight';
import { AeroDataBox } from '@app/flight.vendors/aero.data.box';
import { AeroDataBoxFlight } from '@app/flight.vendors/aero.data.box/types';

function toFlightPayload(entry: AeroDataBoxFlight): Prisma.FlightCreateInput {
  const departureDate = moment.parseZone(entry.departure.actualTimeLocal);
  const arrivalDate = moment.parseZone(entry.arrival.actualTimeLocal);

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
    destinationUtcHourOffset: arrivalDate.utcOffset() / 60,
    estimatedGateArrival: arrivalDate.toDate(),
    estimatedGateDeparture: departureDate.toDate(),
    flightDate: departureDate.date(),
    flightMonth: departureDate.month(),
    flightNumber: entry.number.replace(entry.airline.iata, '').trim(),
    flightYear: departureDate.year(),
    id: uuid.v4(),
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
