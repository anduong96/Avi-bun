import { RadarBox } from '@app/flight.vendors/radar.box';
import { prisma } from '@app/prisma';
import { FlightStatus } from '@prisma/client';
import CronTime from 'cron-time-generator';
import moment from 'moment';
import { Job } from '../job';

export class SyncActivePlaneLocationJob extends Job {
  override cronTime = CronTime.every(3).minutes();

  private async getPlanes() {
    const ceil = moment().endOf('day').add(10, 'hours').toDate();
    const floor = moment().startOf('day').subtract(12, 'hours').toDate();
    this.logger.debug(
      'Syncing planes from [%s] to [%s]',
      floor.toISOString(),
      ceil.toISOString(),
    );

    const flights = await prisma.flight.findMany({
      where: {
        aircraftTailnumber: {
          not: null,
        },
        status: {
          notIn: [
            FlightStatus.ARRIVED,
            FlightStatus.CANCELED,
            FlightStatus.ARCHIVED,
          ],
        },
        scheduledGateDeparture: {
          gt: floor,
          lt: ceil,
        },
      },
      distinct: ['aircraftTailnumber'],
      select: { aircraftTailnumber: true },
    });

    return flights.map(entry => entry.aircraftTailnumber);
  }

  async updateAircraftPosition(tailNumber: string) {
    const aircraft = await prisma.aircraft.findFirstOrThrow({
      where: { tailNumber },
      select: { tailNumber: true, id: true },
    });

    const position = await RadarBox.getAircraft(aircraft.tailNumber);

    await prisma.aircraftPosition.upsert({
      where: {
        aircraftID: aircraft.id,
      },
      update: {
        latitude: position.latitude,
        longitude: position.longitude,
        altitude: position.altitude,
        aircraftID: aircraft.id,
      },
      create: {
        latitude: position.latitude,
        longitude: position.longitude,
        altitude: position.altitude,
        aircraftID: aircraft.id,
      },
    });
  }

  override async onProcess() {
    const planes = await this.getPlanes();
    this.logger.info('Planes to sync', planes.length);
    const result = await Promise.allSettled(
      planes.map(entry =>
        this.updateAircraftPosition(entry!).then(() => entry),
      ),
    );
    this.logger.debug('Planes synced', result);
  }
}
