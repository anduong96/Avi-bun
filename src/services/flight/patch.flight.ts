import { Flight, FlightVendor } from '@prisma/client';

import { FlightStats } from '@app/flight.vendors/flight.stats';
import { Logger } from '../logger';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { prisma } from '@app/prisma';

export async function patchFlight(
  flight: Pick<
    Flight,
    | 'airlineIata'
    | 'flightNumber'
    | 'departureDate'
    | 'originIata'
    | 'destinationIata'
  >,
): Promise<void> {
  Logger.info('Patching flight with flight stats %o', flight);
  const remoteFlights = await FlightStats.searchFlights({
    airlineIata: flight.airlineIata,
    flightNumber: flight.flightNumber,
    departureDate: flight.departureDate,
  });

  if (isEmpty(remoteFlights)) {
    Logger.error('No flights found! %o', { flight });
    throw new Error('No flight(s) found!');
  }

  for await (const entry of remoteFlights) {
    if (!moment(entry.date).isSame(flight.departureDate)) {
      continue;
    }

    const storedFlight = await prisma.flight.update({
      where: {
        airlineIata_flightNumber_originIata_destinationIata_departureDate: {
          departureDate: flight.departureDate,
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
