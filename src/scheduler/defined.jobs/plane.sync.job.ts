import { RadarBox } from '@app/flight.vendors/radar.box';
import { prisma } from '@app/prisma';
import { Aircraft, FlightStatus } from '@prisma/client';
import CronTime from 'cron-time-generator';
import moment from 'moment';
import { Job } from '../job';

export class SyncActivePlaneLocationJob extends Job {
  override cronTime = CronTime.every(1).minutes();

  private async getPlanes() {
    const ceil = moment().endOf('day').add(10, 'hours').toDate();
    const floor = moment().startOf('day').subtract(12, 'hours').toDate();
    this.logger.debug(
      'Syncing planes from [%s] to [%s]',
      floor.toISOString(),
      ceil.toISOString(),
    );

    const aircrafts = await prisma.aircraft.findMany({
      take: 20,
      distinct: ['tailNumber', 'airlineIata'],
      select: {
        id: true,
        tailNumber: true,
        airlineIata: true,
      },
      where: {
        updatedAt: {
          lt: moment().subtract(5, 'minutes').toDate(),
        },
        Flights: {
          some: {
            status: {
              notIn: [
                FlightStatus.ARRIVED,
                FlightStatus.CANCELED,
                FlightStatus.ARCHIVED,
              ],
            },
            estimatedGateDeparture: {
              gt: floor,
              lt: ceil,
            },
            UserFlight: {
              some: {},
            },
          },
        },
      },
    });

    return aircrafts;
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
    const planes = await this.getPlanes();
    this.logger.info(
      'Planes to sync',
      planes.map(plane => plane.tailNumber),
    );

    const result = await Promise.allSettled(
      planes.map(entry => this.updateAircraftPosition(entry).then(() => entry)),
    );

    this.logger.debug('Planes synced', result);
  }
}
