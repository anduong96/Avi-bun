import { Aircraft } from '@prisma/client';
import { Topic } from '../topic';

export class AircraftCreatedTopic extends Topic {
  constructor(readonly aircraft: Aircraft) {
    super();
  }
}
