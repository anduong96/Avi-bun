import * as uuid from 'uuid';
import { omit } from 'lodash';
import { FlightVendor, Prisma } from '@prisma/client';

import { Logger } from '@app/lib/logger';
import { toDateOrNull } from '@app/lib/date.or.null';
import { FlightQueryParam } from '@app/types/flight';
import { timezoneToUtcOffset } from '@app/lib/timezone';
import { FlightStats } from '@app/vendors/flights/flight.stats';
import { toFlightStatus } from '@app/vendors/flights/flight.stats/utils';

import { getFlightTimelinePayload } from '../flight.timeline/get.flight.timeline.payload';

export function flightStatFlightToFlightPayload(
  flight: Awaited<ReturnType<(typeof FlightStats)['getFlightDetails']>>,
): RequiredKeys<Prisma.FlightUncheckedCreateInput, 'id'> {
  const flightID = uuid.v4();
  const info = flight.additionalFlightInfo;
  const aircraftTailNumber = info.equipment?.tailNumber;
  const status = toFlightStatus(flight.status.status);
  const { arrivalAirport, departureAirport, schedule } = flight;
  const {
    actualGateArrivalUTC,
    actualGateDepartureUTC,
    estimatedGateArrivalUTC,
    estimatedGateDepartureUTC,
    scheduledGateArrivalUTC,
    scheduledGateDepartureUTC,
  } = schedule;

  const scheduledGateDeparture = toDateOrNull(scheduledGateDepartureUTC);
  const scheduledGateArrival = toDateOrNull(scheduledGateArrivalUTC);
  const actualGateArrival = toDateOrNull(actualGateArrivalUTC);
  const actualGateDeparture = toDateOrNull(actualGateDepartureUTC);
  const estimatedGateArrival = toDateOrNull(
    estimatedGateArrivalUTC ?? actualGateArrival ?? scheduledGateArrival,
  );
  const estimatedGateDeparture = toDateOrNull(
    estimatedGateDepartureUTC ?? actualGateDeparture ?? scheduledGateDeparture,
  );
  const originUtcHourOffset = timezoneToUtcOffset(
    departureAirport.timeZoneRegionName,
  );
  const destinationUtcHourOffset = timezoneToUtcOffset(
    arrivalAirport.timeZoneRegionName,
  );

  return {
    FlightTimeline: {
      create: getFlightTimelinePayload(flightID, flight).map(entry =>
        omit(entry, ['flightID']),
      ),
    },
    FlightVendorConnection: {
      create: {
        vendor: FlightVendor.FLIGHT_STATS,
        vendorResourceID: flight.flightId.toString(),
      },
    },
    actualGateArrival,
    actualGateDeparture,
    aircraftTailNumber: aircraftTailNumber,
    airlineIata: flight.airlineIata,
    destinationBaggageClaim: flight.arrivalAirport.baggage,
    destinationGate: flight.arrivalAirport.gate,
    destinationIata: flight.arrivalAirport.iata,
    destinationTerminal: flight.arrivalAirport.terminal,
    destinationUtcHourOffset,
    estimatedGateArrival: estimatedGateArrival!,
    estimatedGateDeparture: estimatedGateDeparture!,
    flightDate: flight.flightDate,
    flightMonth: flight.flightMonth,
    flightNumber: flight.flightNumber,
    flightYear: flight.flightYear,
    id: flightID,
    originGate: flight.departureAirport.gate,
    originIata: flight.departureAirport.iata,
    originTerminal: flight.departureAirport.terminal,
    originUtcHourOffset,
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

  const flightsPayload: ReturnType<typeof flightStatFlightToFlightPayload>[] =
    [];

  for (const item of detailFlights) {
    if (item.status !== 'fulfilled') {
      Logger.debug('Unable to get flight details', item.reason);
      continue;
    }

    flightsPayload.push(flightStatFlightToFlightPayload(item.value));
  }

  return flightsPayload;
}
