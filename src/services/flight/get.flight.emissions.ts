import { Prisma } from '@prisma/client';

import { Logger } from '@app/lib/logger';
import { Sentry } from '@app/lib/sentry';
import { FlightQueryParam } from '@app/types/flight';
import { Flightera } from '@app/vendors/flights/flightera';

export async function getFlightEmissions(
  params: Pick<FlightQueryParam, 'airlineIata' | 'flightNumber'>,
): Promise<Pick<
  Prisma.FlightCreateInput,
  | 'co2EmissionKgBusiness'
  | 'co2EmissionKgEco'
  | 'co2EmissionKgEconomy'
  | 'co2EmissionKgFirst'
  | 'totalDistanceKm'
> | null> {
  try {
    const flighteraFlight = await Flightera.getFlightFromCrawl({
      airlineIata: params.airlineIata,
      flightNumber: params.flightNumber,
    });

    return {
      co2EmissionKgBusiness: flighteraFlight.co2EmissionKg.Business,
      co2EmissionKgEco: flighteraFlight.co2EmissionKg['Eco+'],
      co2EmissionKgEconomy: flighteraFlight.co2EmissionKg.Economy,
      co2EmissionKgFirst: flighteraFlight.co2EmissionKg.First,
      totalDistanceKm: flighteraFlight.distanceKm,
    };
  } catch (error) {
    Logger.error('Unable to get flight details from Flightera', error);
    Sentry.captureException(error);
    return null;
  }
}
