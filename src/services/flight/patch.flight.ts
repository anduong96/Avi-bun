import { Flight } from '@prisma/client';
import { FlightStats } from '@app/flight.vendors/flight.stats';
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
  const remoteFlight = await FlightStats.getFlightDetails({
    date: flight.departureDate,
    airlineIata: flight.airlineIata,
    flightNumber: flight.flightNumber,
  });

  const estimatedGateDeparture = moment(
    remoteFlight.schedule.estimatedGateDepartureUTC ||
      remoteFlight.schedule.scheduledGateDepartureUTC,
  );

  await prisma.flight.update({
    where: {
      airlineIata_flightNumber_originIata_destinationIata_departureDate: {
        airlineIata: flight.airlineIata,
        flightNumber: flight.flightNumber,
        departureDate: flight.departureDate,
        originIata: flight.originIata,
        destinationIata: flight.destinationIata,
      },
    },
    data: {
      estimatedGateDeparture: estimatedGateDeparture.toDate(),
    },
  });
}
