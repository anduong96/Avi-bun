import { Flight, FlightStatus } from '@prisma/client';

import CronTime from 'cron-time-generator';
import { FlightStats } from '@app/services/flight.vendors/flight.stats';
import { FlightStats_Status } from '@app/services/flight.vendors/flight.stats/enums';
import { Job } from '../job';
import { isDev } from '@app/services/env';
import moment from 'moment-timezone';
import { prisma } from '@app/prisma';
import { sendFlightAlert } from '@app/services/alerts/flight.alert';
import { toFlightStatus } from '@app/services/flight.vendors/flight.stats/utils';
import { tryNice } from 'try-nice';

export class SyncActiveFlightsJob extends Job {
  cronTime: string = CronTime.every(5).minutes();

  private async checkRemote(flight: Flight) {
    this.logger.info(`Starting Flight: ${flight.id}`);

    const [result, error] = await tryNice(() =>
      FlightStats.getFlightDetails({
        flightID: flight.vendorResourceID!,
        date: flight.departureDate,
        airlineIata: flight.airlineIata,
        flightNumber: flight.flightNumber,
      }),
    );

    if (error || !result) {
      await prisma.flight.update({
        where: {
          id: flight.id,
        },
        data: {
          reconAttempt: {
            increment: 1,
          },
        },
      });

      if (!result) {
        this.logger.warn(`Failed to find flight: ${flight.id}`);
      } else if (error) {
        this.logger.error(error);
      }

      return;
    }

    const flightStatus = result.status.status;
    const schedule = result.schedule;
    const status = toFlightStatus(result);
    const flightTitle = flight.airlineIata + flight.flightNumber;
    const estimatedDeparture = moment(schedule.estimatedGateDepartureUTC);
    const estimatedArrival = moment(schedule.estimatedGateArrivalUTC);

    const writeResult = await prisma.flight.update({
      select: {
        id: true,
      },
      where: {
        id: flight.id,
      },
      data: {
        status,
        vendorResourceID: result.flightId.toString(),
        estimatedGateDeparture: estimatedDeparture.toDate(),
        estimatedGateArrival: estimatedArrival.toDate(),
        reconAttempt: {
          increment: 1,
        },
      },
    });

    if (writeResult) {
      this.logger.debug(`Updated flight: ${flight.id}`);
    }

    const destination = await prisma.airport.findFirstOrThrow({
      where: {
        iata: flight.destinationIata,
      },
      select: {
        cityCode: true,
        cityName: true,
      },
    });

    const destinationName = destination.cityName || destination.cityCode;
    //TODO: build logic engine

    if (
      flightStatus === FlightStats_Status.CANCELED &&
      flight.status !== FlightStatus.CANCELED
    ) {
      await this.notifyFlightGroup({
        flight,
        title: `${flightTitle}: Cancelled`,
        body: `Your flight to ${destinationName} was cancelled`,
      });
    }

    const delayDiff = estimatedDeparture.diff(flight.estimatedGateDeparture);
    const delayDiffDur = moment.duration(delayDiff);

    this.logger.info(`Flight: ${flight.id}`, {
      delayDiff,
      estimatedDeparture,
      estimatedArrival,
      flight,
    });

    if (delayDiffDur.minutes() > 0) {
      await this.notifyFlightGroup({
        flight,
        title: `${flightTitle}: Delayed`,
        body: `Your flight to ${destinationName} is delayed. Expected departure at ${estimatedDeparture.format(
          'L',
        )}`,
      });
    }
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

  async onProcess() {
    if (isDev) {
      return;
    }

    const flights = await prisma.flight.findMany({
      where: {
        UserFlight: {
          some: {
            shouldAlert: true,
          },
        },
        vendorResourceID: {
          not: null,
        },
        status: {
          not: FlightStatus.ARRIVED,
        },
        scheduledGateDeparture: {
          gt: moment().startOf('day').subtract(12, 'hours').toDate(),
          lt: moment().endOf('day').add(10, 'hours').toDate(),
        },
      },
    });

    this.logger.info('Flights to sync', flights.length);
    await Promise.allSettled(flights.map(flight => this.checkRemote(flight)));
  }
}
