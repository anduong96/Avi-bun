import { Prisma } from '@prisma/client';

import { Logger } from '@app/lib/logger';
import { Sentry } from '@app/lib/sentry';
import { FlightQueryParam } from '@app/types/flight';
import { Flightera } from '@app/flight.vendors/flightera';

export async function patchFlightPayloadWithFlightera<
  P extends Prisma.FlightCreateInput | Prisma.FlightCreateInput[],
>(payload: P, params: Pick<FlightQueryParam, 'airlineIata' | 'flightNumber'>) {
  type Result = P extends Array<unknown>
    ? Prisma.FlightCreateInput[]
    : Prisma.FlightCreateInput;

  let result = payload;

  try {
    const flighteraFlight = await Flightera.getFlightFromCrawl({
      airlineIata: params.airlineIata,
      flightNumber: params.flightNumber,
    });

    function updatePayload(entry: Prisma.FlightCreateInput) {
      return {
        ...entry,
        co2EmissionKgBusiness: flighteraFlight.co2EmissionKg.Business,
        co2EmissionKgEco: flighteraFlight.co2EmissionKg['Eco+'],
        co2EmissionKgEconomy: flighteraFlight.co2EmissionKg.Economy,
        co2EmissionKgFirst: flighteraFlight.co2EmissionKg.First,
        totalDistanceKm: flighteraFlight.distanceKm || entry.totalDistanceKm,
      };
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    result = Array.isArray(payload)
      ? payload.map(updatePayload)
      : updatePayload(payload);
  } catch (error) {
    Logger.error('Unable to get flight details from Flightera', error);
    Sentry.captureException(error);
  }

  return result as unknown as Result;
}
