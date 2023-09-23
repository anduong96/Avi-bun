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
    | 'originDepartureDate'
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

    const storedFlight = await prisma.flight.update({
      where: {
        airlineIata_flightNumber_originIata_destinationIata_originDepartureDate:
          {
            originDepartureDate: flight.originDepartureDate,
            airlineIata: flight.airlineIata,
            flightNumber: flight.flightNumber,
            originIata: flight.originIata,
            destinationIata: flight.destinationIata,
          },
      },
      data: {
        FlightVendorConnection: {
          create: {
            vendor: FlightVendor.FLIGHT_STATS,
            vendorResourceID: entry.flightID,
          },
        },
      },
      select: {
        id: true,
      },
    });

    Logger.info(
      'Added Flight Stats ID[%s] for Flight[%s]',
      entry.flightID,
      storedFlight.id,
    );
  }
}
