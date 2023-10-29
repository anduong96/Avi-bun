import { Prisma } from '@prisma/client';

import { Logger } from '@app/lib/logger';
import { Sentry } from '@app/lib/sentry';
import { FlightQueryParam } from '@app/types/flight';
import { Flightera } from '@app/flight.vendors/flightera';

export async function patchFlightPayloadWithFlightera<
  P extends
    | Prisma.FlightCreateInput
    | Prisma.FlightCreateInput[]
    | Prisma.FlightUncheckedCreateInput
    | Prisma.FlightUncheckedCreateInput[],
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

    function updatePayload<
      E extends Prisma.FlightCreateInput | Prisma.FlightUncheckedCreateInput,
    >(entry: E): E {
      return {
        ...entry,
        co2EmissionKgBusiness: flighteraFlight.co2EmissionKg.Business,
        co2EmissionKgEco: flighteraFlight.co2EmissionKg['Eco+'],
        co2EmissionKgEconomy: flighteraFlight.co2EmissionKg.Economy,
        co2EmissionKgFirst: flighteraFlight.co2EmissionKg.First,
        totalDistanceKm: flighteraFlight.distanceKm || entry.totalDistanceKm,
      };
    }

    result = (
      Array.isArray(payload)
        ? payload.map(updatePayload)
        : updatePayload(payload)
    ) as typeof result;
  } catch (error) {
    Logger.error('Unable to get flight details from Flightera', error);
    Sentry.captureException(error);
  }

  return result as unknown as Result;
}
