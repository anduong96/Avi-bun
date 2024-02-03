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
        isArchived: true,
      },
      where: {
        estimatedGateArrival: {
          lte: moment().subtract(60, 'minutes').toDate(),
        },
        isArchived: false,
        status: {
          notIn: [FlightStatus.ARCHIVED],
        },
      },
    });

    if (result.count > 0) {
      this.logger.warn('Archived flights', result);
    }
  }
}
