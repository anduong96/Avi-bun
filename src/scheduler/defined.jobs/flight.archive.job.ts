import CronTime from 'cron-time-generator';
import { FlightStatus } from '@prisma/client';
import { Job } from '../job';
import moment from 'moment';
import { prisma } from '@app/prisma';

export class ArchiveFlightJob extends Job {
  readonly cronTime = CronTime.every(10).minutes();

  async onProcess() {
    const result = await prisma.flight.updateMany({
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
