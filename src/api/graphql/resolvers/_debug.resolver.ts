import { sendFlightAlert } from '@app/services/alerts/flight.alert';
import { JSONResolver } from 'graphql-scalars';
import { Arg, Mutation, Resolver } from 'type-graphql';

@Resolver()
export class DebugResolver {
  @Mutation(() => Number)
  async _sendFlightNotification(
    @Arg('flightID') flightID: string,
    @Arg('title') title: string,
    @Arg('body') body: string,
    @Arg('data', () => JSONResolver) data: object,
  ): Promise<number> {
    const result = await sendFlightAlert(flightID, {
      title,
      body,
      data,
    });

    return result;
  }
}
