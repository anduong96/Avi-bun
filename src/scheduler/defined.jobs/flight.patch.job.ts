import CronTime from 'cron-time-generator';
import { FlightVendor } from '@prisma/client';
import { Job } from '../job';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { patchFlight } from '@app/services/flight/patch.flight';
import { prisma } from '@app/prisma';

export class PatchFlightsJob extends Job {
  cronTime: string = CronTime.every(5).minutes();

  async onProcess() {
    const flights = await prisma.flight.findMany({
      take: 50,
      where: {
        FlightVendorConnection: {
          none: {
            vendor: FlightVendor.FLIGHT_STATS,
          },
        },
        estimatedGateDeparture: {
          gt: moment().add(1, 'days').toDate(),
          lt: moment().add(3, 'days').toDate(),
        },
      },
    });

    if (isEmpty(flights)) {
      this.logger.debug('No flight(s) to patch');
      return;
    }

    const result = await Promise.allSettled(
      flights.map(async flight => {
        await patchFlight(flight);
        return flight.id;
      }),
    );

    this.logger.info('Patched flight %o', result);
  }
}
