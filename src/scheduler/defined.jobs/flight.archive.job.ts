import moment from 'moment';
import { FlightStatus } from '@prisma/client';

import { prisma } from '@app/prisma';

import { Job } from '../job';

export class ArchiveFlightJob extends Job {
  constructor() {
    super();
  }

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
          notIn: [FlightStatus.ARCHIVED, FlightStatus.CANCELED],
        },
      },
    });

    if (result.count > 0) {
      this.logger.warn('Archived flights', result);
    }
  }
}
