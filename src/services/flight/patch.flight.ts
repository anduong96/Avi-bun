import { isEmpty, pick } from 'lodash';
import { Flight, FlightVendor } from '@prisma/client';

import { prisma } from '@app/prisma';
import { FlightStats } from '@app/api.vendors/flight.stats';

import { Logger } from '../../lib/logger';

export async function patchFlight(
  flight: Pick<
    Flight,
    | 'airlineIata'
    | 'destinationIata'
    | 'flightDate'
    | 'flightMonth'
    | 'flightNumber'
    | 'flightYear'
    | 'id'
    | 'originIata'
  >,
): Promise<void> {
  Logger.info('Patching flight[%s] with Flight Stats', flight.id);
  const remoteFlights = await FlightStats.searchFlights({
    airlineIata: flight.airlineIata,
    flightNumber: flight.flightNumber,
  });

  Logger.debug('Remote flights %s', remoteFlights.length);

  if (isEmpty(remoteFlights)) {
    Logger.error('No flights found! %o', { flight });
    throw new Error('No flight(s) found!');
  }

  for await (const entry of remoteFlights) {
    Logger.info(
      'Adding Flight Stats ID[%s] for Flight[%o]',
      entry.url,
      pick(flight, [
        'airlineIata',
        'flightNumber',
        'departureDate',
        'originIata',
        'destinationIata',
      ]),
    );

    const dbFlight = await prisma.flight.findFirst({
      select: {
        id: true,
      },
      where: {
        airlineIata: flight.airlineIata,
        destinationIata: flight.destinationIata,
        flightDate: flight.flightDate,
        flightMonth: flight.flightMonth,
        flightNumber: flight.flightNumber,
        flightYear: flight.flightYear,
        originIata: flight.originIata,
      },
    });

    if (!dbFlight) {
      continue;
    }

    const vendorConn = await prisma.flightVendorConnection.create({
      data: {
        flightID: dbFlight.id,
        vendor: FlightVendor.FLIGHT_STATS,
        vendorResourceID: entry.flightID,
      },
    });

    Logger.info(
      'Added Flight Stats ID[%s] for Flight[%s]',
      entry.flightID,
      vendorConn.id,
    );
  }
}
