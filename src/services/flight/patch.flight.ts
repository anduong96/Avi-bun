import { Flight, FlightVendor } from '@prisma/client';

import { FlightStats } from '@app/lib/flight.vendors/flight.stats';
import { prisma } from '@app/prisma';
import { isEmpty, pick } from 'lodash';
import { Logger } from '../../lib/logger';

export async function patchFlight(
  flight: Pick<
    Flight,
    | 'id'
    | 'airlineIata'
    | 'flightNumber'
    | 'flightDate'
    | 'flightYear'
    | 'flightMonth'
    | 'originIata'
    | 'destinationIata'
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
      where: {
        flightYear: flight.flightYear,
        flightMonth: flight.flightMonth,
        flightDate: flight.flightDate,
        airlineIata: flight.airlineIata,
        flightNumber: flight.flightNumber,
        originIata: flight.originIata,
        destinationIata: flight.destinationIata,
      },
      select: {
        id: true,
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
