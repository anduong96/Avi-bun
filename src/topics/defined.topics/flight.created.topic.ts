import { Flight } from '@prisma/client';

import { Topic } from '../topic';

export class FlightCreatedTopic extends Topic {
  constructor(readonly flightID: Flight['id']) {
    super();
  }
}
