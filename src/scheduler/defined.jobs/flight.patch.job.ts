import { prisma } from '@app/prisma';
import { patchFlight } from '@app/services/flight/patch.flight';
import { FlightVendor } from '@prisma/client';
import CronTime from 'cron-time-generator';
import { isEmpty, noop } from 'lodash';
import moment from 'moment';
import { Job } from '../job';

export class PatchFlightsJob extends Job {
  cronTime: string = CronTime.every(5).minutes();

  async onProcess() {
    const ceil = moment().add(3, 'days').toDate();
    const floor = moment().subtract(2, 'days').toDate();

    this.logger.debug('Patch flights between\n', {
      floor,
      ceil,
    });

    const flights = await prisma.flight.findMany({
      take: 50,
      where: {
        estimatedGateDeparture: {
          gt: floor,
          lt: ceil,
        },
        FlightVendorConnection: {
          every: {
            NOT: {
              vendor: FlightVendor.FLIGHT_STATS,
            },
          },
        },
      },
      // select: {
      //   id: true,
      //   flightNumber: true,
      //   airlineIata: true,
      //   FlightVendorConnection: true,
      // },
    });

    if (isEmpty(flights)) {
      this.logger.debug('No flight(s) to patch');
      return;
    }

    this.logger.debug('Flights to patch', flights.length);

    const result = await Promise.allSettled(
      flights.map(flight => patchFlight(flight).then(() => flight.id)),
    );

    this.logger.info('Patched flight\n', result);
  }
}

new PatchFlightsJob().onProcess().catch(noop);
