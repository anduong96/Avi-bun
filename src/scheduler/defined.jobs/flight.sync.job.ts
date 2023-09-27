import { Flight, FlightStatus, FlightVendor, Prisma } from '@prisma/client';

import { FlightStats } from '@app/lib/flight.vendors/flight.stats';
import { FlightStats_Status } from '@app/flight.vendors/flight.stats/enums';
import { prisma } from '@app/prisma';
import { sendFlightAlert } from '@app/services/alerts/flight.alert';
import { flightStatFlightToFlightPayload } from '@app/services/flight/flights.payload.from.flights.stat';
import CronTime from 'cron-time-generator';
import moment from 'moment-timezone';
import { tryNice } from 'try-nice';
import { Job } from '../job';

export class SyncActiveFlightsJob extends Job {
  cronTime: string = CronTime.every(5).minutes();
  constructor() {
    super();
    // this.onProcess().catch(() => {});
  }

  private async checkRemote(flight: Flight, flightStatsID: string) {
    this.logger.info(`Starting Flight: ${flight.id}`);

    const [result, error] = await tryNice(() =>
      FlightStats.getFlightDetails({
        flightID: flightStatsID,
        flightYear: flight.flightYear,
        flightMonth: flight.flightMonth,
        flightDate: flight.flightDate,
        airlineIata: flight.airlineIata,
        flightNumber: flight.flightNumber,
      }),
    );

    if (error || !result) {
      await prisma.flight.update({
        where: { id: flight.id },
        data: { reconAttempt: { increment: 1 } },
      });

      this.logger.warn(
        `Failed to find flight[%s] flightStatsID[%s]`,
        flight.id,
        flightStatsID,
        error,
      );

      return;
    }

    const payload = flightStatFlightToFlightPayload(result);
    const updateData: Prisma.FlightUpdateInput = {
      status: payload.status,
      estimatedGateDeparture: payload.estimatedGateDeparture,
      estimatedGateArrival: payload.estimatedGateArrival,
      actualGateArrival: payload.actualGateArrival,
      actualGateDeparture: payload.actualGateDeparture,
      destinationBaggageClaim: payload.destinationBaggageClaim,
      destinationGate: payload.destinationGate,
      destinationTerminal: payload.destinationTerminal,
      originGate: payload.originGate,
      originTerminal: payload.originTerminal,
      reconAttempt: {
        increment: 1,
      },
    };

    this.logger.debug('Flight[%s] updateData[%o]', flight.id, updateData);

    const writeResult = await prisma.flight.update({
      where: { id: flight.id },
      select: { id: true },
      data: updateData,
    });

    if (writeResult) {
      this.logger.debug(
        `Updated flight[%s] result[%o]`,
        flight.id,
        writeResult,
      );
    }

    const destination = await prisma.airport.findFirstOrThrow({
      where: { iata: flight.destinationIata },
      select: { cityCode: true, cityName: true },
    });

    const destinationName = destination.cityName || destination.cityCode;
    const flightTitle = payload.airlineIata + payload.flightNumber;
    //TODO: build logic engine

    if (
      result.status.status === FlightStats_Status.CANCELED &&
      flight.status !== FlightStatus.CANCELED
    ) {
      await this.notifyFlightGroup({
        flight,
        title: `${flightTitle}: Cancelled`,
        body: `Your flight to ${destinationName} was cancelled`,
      });
    }

    const delayDiff = moment(payload.scheduledGateDeparture).diff(
      flight.estimatedGateDeparture,
    );
    const delayDiffDur = moment.duration(delayDiff);

    this.logger.info(`Flight[%s] diff[%s]`, flight.id, delayDiffDur);

    if (delayDiffDur.minutes() > 0) {
      const title = `${flightTitle}: Delayed`;
      const delayedTimeAt = moment(payload.estimatedGateDeparture).format('L');
      const body = `Your flight to ${destinationName} is delayed. Expected departure at ${delayedTimeAt}`;

      await this.notifyFlightGroup({
        flight,
        title,
        body,
      });
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
        vendor: FlightVendor.FLIGHT_STATS,
        Flight: {
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
      },
    });

    return candidates;
  }

  /**
   * The function `notifyFlightGroup` sends a notification to a group of devices subscribed to a
   * specific flight.
   * @param args - The parameters for the `notifyFlightGroup` function are:
   */
  private async notifyFlightGroup(args: {
    flight: Flight;
    title: string;
    body: string;
  }) {
    const response = await sendFlightAlert(args.flight.id, {
      title: args.title,
      body: args.body,
    });

    this.logger.warn(
      `Sent notification to subscribers for flight: ${args.flight.id}`,
      response,
    );
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
