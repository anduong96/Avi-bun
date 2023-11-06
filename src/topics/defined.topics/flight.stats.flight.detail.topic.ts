import { Flight } from '@prisma/client';

import { FlightStats } from '@app/flight.vendors/flight.stats';

import { Topic } from '../topic';

export class FlightStatsFlightDetailTopic extends Topic {
  constructor(
    readonly flightID: Flight['id'],
    readonly data: Awaited<
      ReturnType<(typeof FlightStats)['getFlightDetails']>
    >,
  ) {
    super();
  }
}
