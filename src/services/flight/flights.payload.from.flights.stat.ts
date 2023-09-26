import { toDateOrNull } from '@app/lib/date.or.null';
import { FlightStats } from '@app/lib/flight.vendors/flight.stats';
import { toFlightStatus } from '@app/lib/flight.vendors/flight.stats/utils';
import { Logger } from '@app/lib/logger';
import { FlightQueryParam } from '@app/types/flight';
import { FlightVendor, Prisma } from '@prisma/client';
import * as uuid from 'uuid';

export function flightStatFlightToFlightPayload(
  flight: Awaited<ReturnType<(typeof FlightStats)['getFlightDetails']>>,
): Prisma.FlightUncheckedCreateInput {
  const info = flight.additionalFlightInfo;
  const schedule = flight.schedule;
  const aircraftTailnumber = info.equipment?.tailNumber;
  const status = toFlightStatus(flight.status.status);
  const {
    scheduledGateDepartureUTC,
    scheduledGateArrivalUTC,
    estimatedGateArrivalUTC,
    estimatedGateDepartureUTC,
    actualGateArrivalUTC,
    actualGateDepartureUTC,
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
    id: uuid.v4(),
    FlightVendorConnection: {
      create: {
        vendor: FlightVendor.FLIGHT_STATS,
        vendorResourceID: flight.flightId.toString(),
      },
    },
    flightYear: flight.flightYear,
    flightMonth: flight.flightMonth,
    flightDate: flight.flightDate,
    flightNumber: flight.flightNumber,
    airlineIata: flight.airlineIata,
    aircraftTailnumber: aircraftTailnumber,
    originIata: flight.departureAirport.iata,
    originTerminal: flight.departureAirport.terminal,
    originGate: flight.departureAirport.gate,
    destinationIata: flight.arrivalAirport.iata,
    destinationTerminal: flight.arrivalAirport.terminal,
    destinationGate: flight.arrivalAirport.gate,
    destinationBaggageClaim: flight.arrivalAirport.baggage,
    status: status,
    scheduledGateDeparture: scheduledGateDeparture!,
    scheduledGateArrival: scheduledGateArrival!,
    estimatedGateArrival: estimatedGateArrival!,
    estimatedGateDeparture: estimatedGateDeparture!,
    actualGateArrival: toDateOrNull(actualGateArrivalUTC),
    actualGateDeparture: toDateOrNull(actualGateDepartureUTC),
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
        flightID: entry.flightID,
        flightNumber: params.flightNumber,
        airlineIata: params.airlineIata,
        flightYear: entry.year,
        flightMonth: entry.month,
        flightDate: entry.date,
      }),
    ),
  );

  const flightsPayload: Prisma.FlightUncheckedCreateInput[] = [];

  for (const item of detailFlights) {
    if (item.status !== 'fulfilled') {
      Logger.debug('Unable to get flight details', item.reason);
      continue;
    }

    flightsPayload.push(flightStatFlightToFlightPayload(item.value));
  }

  return flightsPayload;
}
