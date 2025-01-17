import moment from 'moment';
import { FlightStatus } from '@prisma/client';

import { prisma } from '@app/prisma';
import { sendFlightAlert } from '@app/services/alerts/flight.alert';

import { Job } from '../job';

export class RemindCheckInFlightsJob extends Job {
  constructor() {
    super();
  }

  async onProcess() {
    const floor = moment().add(24, 'hours');
    const ceil = moment().add(24, 'hours').add(10, 'minutes');

    this.logger.debug('query', {
      ceil: ceil.format('LLL'),
      floor: floor.format('LLL'),
    });

    const flights = await prisma.flight.findMany({
      where: {
        estimatedGateDeparture: {
          gt: floor.toDate(),
          lt: ceil.toDate(),
        },
        status: {
          not: FlightStatus.CANCELED,
        },
      },
    });

    this.logger.debug('Flights to process', flights);

    await Promise.allSettled(
      flights.map(async flight => {
        const flightStr = flight.airlineIata + flight.flightNumber;
        const result = await sendFlightAlert(flight.id, {
          body: `It's time to check-in for your flight.`,
          title: `Check-in for ${flightStr}`,
        });

        this.logger.info('Sent check-in notification for group', {
          flightID: flight.id,
          result,
        });
      }),
    );
  }
}
