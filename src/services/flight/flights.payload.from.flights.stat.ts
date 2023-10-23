import * as uuid from 'uuid';
import { FlightVendor, Prisma } from '@prisma/client';

import { Logger } from '@app/lib/logger';
import { toDateOrNull } from '@app/lib/date.or.null';
import { FlightQueryParam } from '@app/types/flight';
import { timezoneToUtcOffset } from '@app/lib/timezone';
import { FlightStats } from '@app/flight.vendors/flight.stats';
import { toFlightStatus } from '@app/flight.vendors/flight.stats/utils';

export function flightStatFlightToFlightPayload(
  flight: Awaited<ReturnType<(typeof FlightStats)['getFlightDetails']>>,
): Prisma.FlightCreateInput {
  const info = flight.additionalFlightInfo;
  const schedule = flight.schedule;
  const aircraftTailNumber = info.equipment?.tailNumber;
  const status = toFlightStatus(flight.status.status);
  const {
    actualGateArrivalUTC,
    actualGateDepartureUTC,
    estimatedGateArrivalUTC,
    estimatedGateDepartureUTC,
    scheduledGateArrivalUTC,
    scheduledGateDepartureUTC,
  } = schedule;

  const scheduledGateDeparture = toDateOrNull(
    scheduledGateDepartureUTC || estimatedGateDepartureUTC,
  );
  const scheduledGateArrival = toDateOrNull(
    scheduledGateArrivalUTC || estimatedGateArrivalUTC,
  );
  const estimatedGateArrival = toDateOrNull(
    estimatedGateArrivalUTC || scheduledGateArrivalUTC,
  );
  const estimatedGateDeparture = toDateOrNull(
    estimatedGateDepartureUTC || scheduledGateDepartureUTC,
  );

  return {
    Airline: {
      connect: {
        iata: flight.airlineIata,
      },
    },
    Destination: {
      connect: {
        iata: flight.arrivalAirport.iata,
      },
    },
    FlightVendorConnection: {
      create: {
        vendor: FlightVendor.FLIGHT_STATS,
        vendorResourceID: flight.flightId.toString(),
      },
    },
    Origin: {
      connect: {
        iata: flight.departureAirport.iata,
      },
    },
    actualGateArrival: toDateOrNull(actualGateArrivalUTC),
    actualGateDeparture: toDateOrNull(actualGateDepartureUTC),
    aircraftTailNumber: aircraftTailNumber,
    destinationBaggageClaim: flight.arrivalAirport.baggage,
    destinationGate: flight.arrivalAirport.gate,
    destinationTerminal: flight.arrivalAirport.terminal,
    destinationUtcHourOffset: timezoneToUtcOffset(
      flight.arrivalAirport.timeZoneRegionName,
    ),
    estimatedGateArrival: estimatedGateArrival!,
    estimatedGateDeparture: estimatedGateDeparture!,
    flightDate: flight.flightDate,
    flightMonth: flight.flightMonth,
    flightNumber: flight.flightNumber,
    flightYear: flight.flightYear,
    id: uuid.v4(),
    originGate: flight.departureAirport.gate,
    originTerminal: flight.departureAirport.terminal,
    originUtcHourOffset: timezoneToUtcOffset(
      flight.departureAirport.timeZoneRegionName,
    ),
    scheduledGateArrival: scheduledGateArrival!,
    scheduledGateDeparture: scheduledGateDeparture!,
    status: status,
  };
}

export async function getFlightsPayloadFromFlightStats(
  params: FlightQueryParam,
) {
  const remoteFlights = await FlightStats.searchFlights({
    airlineIata: params.airlineIata,
    flightNumber: params.flightNumber,
  });

  const detailFlights = await Promise.allSettled(
    remoteFlights.map(entry =>
      FlightStats.getFlightDetails({
        airlineIata: params.airlineIata,
        flightDate: entry.flightDate,
        flightID: entry.flightID,
        flightMonth: entry.flightMonth,
        flightNumber: params.flightNumber,
        flightYear: entry.flightYear,
      }),
    ),
  );

  const flightsPayload: Prisma.FlightCreateInput[] = [];

  for (const item of detailFlights) {
    if (item.status !== 'fulfilled') {
      Logger.debug('Unable to get flight details', item.reason);
      continue;
    }

    flightsPayload.push(flightStatFlightToFlightPayload(item.value));
  }

  return flightsPayload;
}
