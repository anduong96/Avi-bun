import CronTime from 'cron-time-generator';
import { Job } from '../job';
import { groupBy } from 'lodash';
import moment from 'moment';
import { prisma } from '@app/prisma';

export class PatchFlightsJob extends Job {
  cronTime: string = CronTime.every(5).minutes();

  async onProcess() {
    const flights = await prisma.flight.findMany({
      take: 50,
      where: {
        vendorResourceID: null,
        estimatedGateDeparture: {
          gt: moment().add(1, 'days').toDate(),
          lt: moment().add(3, 'days').toDate(),
        },
      },
    });

    const group = groupBy(
      flights,
      flight => flight.airlineIata + flight.flightNumber,
    );

    await Promise.allSettled(
      Object.values(group).map(([flight]) =>
        this.Flights.populateFlights({
          airlineIata: flight.airlineIata,
          flightNumber: flight.flightNumber,
          departureDate: flight.scheduledGateDeparture,
        }),
      ),
    );
  }
}
