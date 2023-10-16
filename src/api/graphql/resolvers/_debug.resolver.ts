import { JSONResolver } from 'graphql-scalars';
import { Arg, Mutation, Resolver } from 'type-graphql';

import { sendFlightAlert } from '@app/services/alerts/flight.alert';

@Resolver()
export class DebugResolver {
  @Mutation(() => Number)
  async _sendFlightNotification(
    @Arg('flightID') flightID: string,
    @Arg('title') title: string,
    @Arg('body') body: string,
    @Arg('data', () => JSONResolver, { nullable: true }) data: object,
  ): Promise<number> {
    const result = await sendFlightAlert(flightID, {
      body,
      data,
      title,
    });

    return result;
  }
}
