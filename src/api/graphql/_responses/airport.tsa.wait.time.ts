import { Field, ObjectType } from 'type-graphql';

import { ArrayElement } from '@app/types/common';
import { getTsaWaitTimeForFlight } from '@app/services/airports/get.tsa.wait.time';

@ObjectType('AirportTsaWaitTime')
export class GQL_AirportTsaWaitTime
  implements
    Exclude<
      ArrayElement<Awaited<ReturnType<typeof getTsaWaitTimeForFlight>>>,
      undefined
    >
{
  @Field()
  dayOfWeek: number;

  @Field()
  hour: number;

  @Field()
  maxWaitMinute: number;

  @Field()
  updatedAt: Date;
}
