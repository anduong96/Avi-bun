import moment from 'moment';
import { isEmpty } from 'lodash';
import CronTime from 'cron-time-generator';
import { FlightStatus } from '@prisma/client';

import { prisma } from '@app/prisma';
import { updateAircraftPosition } from '@app/services/aircraft/update.aircraft.position';

import { Job } from '../job';

export class SyncActivePlaneLocationJob extends Job {
  override cronTime = CronTime.every(7).minutes();

  constructor() {
    super();
    this.onProcess();
  }

  private async getTailNumbers() {
    const ceil = moment().add(10, 'hours').toDate();
    const floor = moment().subtract(12, 'hours').toDate();

    this.logger.debug(
      'Syncing planes from [%s] to [%s]',
      floor.toISOString(),
      ceil.toISOString(),
    );

    const result = await prisma.userFlight.findMany({
      distinct: ['flightID'],
      include: {
        Flight: {
          select: {
            aircraftTailNumber: true,
          },
        },
      },
      take: 100,
      where: {
        Flight: {
          aircraftTailNumber: {
            not: null,
          },
          scheduledGateDeparture: {
            gt: floor,
            lt: ceil,
          },
          status: {
            notIn: [FlightStatus.ARCHIVED, FlightStatus.CANCELED],
          },
        },
      },
    });

    return result.map(entry => entry.Flight.aircraftTailNumber!);
  }

  override async onProcess() {
    const tailNumbers = await this.getTailNumbers();
    this.logger.info('Planes to sync\n%s', tailNumbers);
    if (isEmpty(tailNumbers)) {
      return;
    }

    const aircraftList = await prisma.aircraft.findMany({
      where: {
        tailNumber: {
          in: tailNumbers,
        },
      },
    });

    const result = await Promise.allSettled(
      aircraftList.map(entry =>
        updateAircraftPosition(entry).then(() => entry.tailNumber),
      ),
    );

    this.logger.debug('Planes synced', result);
  }
}
