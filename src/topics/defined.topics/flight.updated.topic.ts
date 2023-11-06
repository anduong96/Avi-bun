import { Flight } from '@prisma/client';

import { Topic } from '../topic';

export class FlightUpdatedTopic extends Topic {
  constructor(readonly flightID: Flight['id']) {
    super();
  }
}
