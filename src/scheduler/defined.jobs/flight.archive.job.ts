import moment from 'moment';
import CronTime from 'cron-time-generator';
import { FlightStatus } from '@prisma/client';

import { prisma } from '@app/prisma';

import { Job } from '../job';

export class ArchiveFlightJob extends Job {
  readonly cronTime = CronTime.every(10).minutes();

  async onProcess() {
    const result = await prisma.flight.updateMany({
      data: {
        status: FlightStatus.ARCHIVED,
      },
      where: {
        estimatedGateArrival: {
          lte: moment().subtract(60, 'minutes').toDate(),
        },
        status: {
          not: FlightStatus.ARCHIVED,
        },
      },
    });

    if (result.count > 0) {
      this.logger.warn('Archived flights', result);
    }
  }
}
