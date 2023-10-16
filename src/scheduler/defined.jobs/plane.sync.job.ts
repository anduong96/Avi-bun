import moment from 'moment';
import { isEmpty } from 'lodash';
import CronTime from 'cron-time-generator';
import { Aircraft, FlightStatus } from '@prisma/client';

import { prisma } from '@app/prisma';
import { RadarBox } from '@app/flight.vendors/radar.box';

import { Job } from '../job';

export class SyncActivePlaneLocationJob extends Job {
  override cronTime = CronTime.every(7).minutes();

  private async getTailNumbers() {
    const ceil = moment().endOf('day').add(10, 'hours').toDate();
    const floor = moment().startOf('day').subtract(12, 'hours').toDate();
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
            aircraftTailnumber: true,
          },
        },
      },
      take: 100,
      where: {
        Flight: {
          aircraftTailnumber: {
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

    return result.map(entry => entry.Flight.aircraftTailnumber!);
  }

  override async onProcess() {
    const tailNumbers = await this.getTailNumbers();
    this.logger.info('Planes to sync\n%s', tailNumbers);
    if (isEmpty(tailNumbers)) {
      return;
    }

    const aircrafts = await prisma.aircraft.findMany({
      where: {
        tailNumber: {
          in: tailNumbers,
        },
      },
    });

    const result = await Promise.allSettled(
      aircrafts.map(entry =>
        this.updateAircraftPosition(entry).then(() => entry.tailNumber),
      ),
    );

    this.logger.debug('Planes synced', result);
  }

  async updateAircraftPosition(
    aircraft: Pick<Aircraft, 'airlineIata' | 'id' | 'tailNumber'>,
  ) {
    const position = await RadarBox.getAircraft(aircraft.tailNumber);
    if (!position || position?.destinationIata || !position.originIata) {
      return;
    }

    const flightNumber = position?.flightNumberIata.replace(
      aircraft.airlineIata,
      '',
    );

    await prisma.aircraftPosition.upsert({
      create: {
        aircraftID: aircraft.id,
        airlineIata: aircraft.airlineIata,
        altitude: position.altitude,
        destinationIata: position.destinationIata,
        flightDate: position.flightDate.getDate(),
        flightMonth: position.flightDate.getMonth(),
        flightNumber: flightNumber,
        flightYear: position.flightDate.getFullYear(),
        latitude: position.latitude,
        longitude: position.longitude,
        originIata: position.originIata,
        updatedAt: position.updatedAt,
      },
      update: {},
      where: {
        aircraftID: aircraft.id,
        airlineIata: aircraft.airlineIata,
        updatedAt: position.updatedAt,
      },
    });
  }
}
