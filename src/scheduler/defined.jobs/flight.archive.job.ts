import CronTime from 'cron-time-generator';
import { FlightStatus } from '@prisma/client';
import { Job } from '../job';
import { Prisma } from '@app/prisma';
import moment from 'moment';

export class ArchiveFlightJob extends Job {
  readonly cronTime = CronTime.every(10).minutes();

  async onProcess() {
    const result = await Prisma.flight.updateMany({
      where: {
        estimatedGateArrival: {
          lte: moment().subtract(60, 'minutes').toDate(),
        },
        status: {
          not: FlightStatus.ARCHIVED,
        },
      },
      data: {
        status: FlightStatus.ARCHIVED,
      },
    });

    if (result.count > 0) {
      this.logger.warn('Archived flights', result);
    }
  }
}
