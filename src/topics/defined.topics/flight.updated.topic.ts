import { Flight } from '@prisma/client';

import { Topic } from '../topic';

export class FlightUpdatedTopic extends Topic {
  constructor(
    readonly current: Flight,
    readonly previous: Flight,
  ) {
    super();
  }
}
