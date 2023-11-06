import { tryNice } from 'try-nice';
import moment from 'moment-timezone';
import CronTime from 'cron-time-generator';
import { Flight, FlightStatus, FlightVendor, Prisma } from '@prisma/client';

import { prisma } from '@app/prisma';
import { FlightStats } from '@app/flight.vendors/flight.stats';
import { flightStatFlightToFlightPayload } from '@app/services/flight/flights.payload.from.flights.stat';

import { Job } from '../job';

export class SyncActiveFlightsJob extends Job {
  cronTime: string = CronTime.every(5).minutes();
  constructor() {
    super();
  }

  private async checkRemote(flight: Flight, flightStatsID: string) {
    this.logger.info(`Starting Flight: ${flight.id}`);

    const [result, error] = await tryNice(() =>
      FlightStats.getFlightDetails({
        airlineIata: flight.airlineIata,
        flightDate: flight.flightDate,
        flightID: flightStatsID,
        flightMonth: flight.flightMonth,
        flightNumber: flight.flightNumber,
        flightYear: flight.flightYear,
      }),
    );

    if (error || !result) {
      await prisma.flight.update({
        data: { reconAttempt: { increment: 1 } },
        where: { id: flight.id },
      });

      this.logger.warn(
        `Failed to find flight[%s] flightStatsID[%s]`,
        flight.id,
        flightStatsID,
        error,
      );

      return;
    }

    this.logger.debug(
      'FlightStats result for flight[%s]\n%o',
      flight.id,
      result,
    );
    const payload = flightStatFlightToFlightPayload(result);
    const updateData: Prisma.FlightUpdateInput = {
      actualGateArrival: payload.actualGateArrival,
      actualGateDeparture: payload.actualGateDeparture,
      destinationBaggageClaim: payload.destinationBaggageClaim,
      destinationGate: payload.destinationGate,
      destinationTerminal: payload.destinationTerminal,
      estimatedGateArrival: payload.estimatedGateArrival,
      estimatedGateDeparture: payload.estimatedGateDeparture,
      originGate: payload.originGate,
      originTerminal: payload.originTerminal,
      reconAttempt: {
        increment: 1,
      },
      status: payload.status,
    };

    this.logger.debug('Flight[%s] updateData[%o]', flight.id, updateData);

    const writeResult = await prisma.flight.update({
      data: updateData,
      select: { id: true },
      where: { id: flight.id },
    });

    if (writeResult) {
      this.logger.debug(
        `Updated flight[%s] result[%o]`,
        flight.id,
        writeResult,
      );
    }
  }

  private async getFlights() {
    const ceil = moment().endOf('day').add(10, 'hours').toDate();
    const floor = moment().startOf('day').subtract(12, 'hours').toDate();
    this.logger.debug(
      'Syncing flights from [%s] to [%s]',
      floor.toISOString(),
      ceil.toISOString(),
    );

    const candidates = await prisma.flightVendorConnection.findMany({
      select: {
        Flight: true,
        vendorResourceID: true,
      },
      where: {
        Flight: {
          scheduledGateDeparture: {
            gt: floor,
            lt: ceil,
          },
          status: {
            notIn: [
              FlightStatus.ARRIVED,
              FlightStatus.CANCELED,
              FlightStatus.ARCHIVED,
            ],
          },
        },
        vendor: FlightVendor.FLIGHT_STATS,
      },
    });

    return candidates;
  }

  override async onProcess() {
    const flights = await this.getFlights();
    this.logger.info('Flights to sync', flights.length);
    const result = await Promise.allSettled(
      flights.map(entry =>
        this.checkRemote(entry.Flight, entry.vendorResourceID).then(
          () => entry.Flight.id,
        ),
      ),
    );
    this.logger.debug('Flights synced', result);
  }
}
