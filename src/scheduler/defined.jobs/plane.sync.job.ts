import { RadarBox } from '@app/flight.vendors/radar.box';
import { prisma } from '@app/prisma';
import { Aircraft, FlightStatus } from '@prisma/client';
import CronTime from 'cron-time-generator';
import moment from 'moment';
import { Job } from '../job';
import { isEmpty } from 'lodash';

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
      take: 100,
      distinct: ['flightID'],
      where: {
        Flight: {
          aircraftTailnumber: {
            not: null,
          },
          status: {
            notIn: [FlightStatus.ARCHIVED, FlightStatus.CANCELED],
          },
          scheduledGateDeparture: {
            gt: floor,
            lt: ceil,
          },
        },
      },
      include: {
        Flight: {
          select: {
            aircraftTailnumber: true,
          },
        },
      },
    });

    return result.map(entry => entry.Flight.aircraftTailnumber!);
  }

  async updateAircraftPosition(
    aircraft: Pick<Aircraft, 'id' | 'tailNumber' | 'airlineIata'>,
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
      where: {
        updatedAt: position.updatedAt,
        aircraftID: aircraft.id,
        airlineIata: aircraft.airlineIata,
      },
      update: {},
      create: {
        updatedAt: position.updatedAt,
        latitude: position.latitude,
        longitude: position.longitude,
        altitude: position.altitude,
        aircraftID: aircraft.id,
        airlineIata: aircraft.airlineIata,
        flightNumber: flightNumber,
        originIata: position.originIata,
        destinationIata: position.destinationIata,
        flightYear: position.flightDate.getFullYear(),
        flightMonth: position.flightDate.getMonth(),
        flightDate: position.flightDate.getDate(),
      },
    });
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
}
