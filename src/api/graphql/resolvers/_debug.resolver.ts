import { sendFlightAlert } from '@app/services/alerts/flight.alert';
import JsonScalar from 'graphql-type-json';
import { Arg, Mutation, Resolver } from 'type-graphql';

@Resolver()
export class DebugResolver {
  @Mutation(() => Number)
  async _sendFlightNotification(
    @Arg('flightID') flightID: string,
    @Arg('title') title: string,
    @Arg('body') body: string,
    @Arg('data', () => JsonScalar) data: object,
  ): Promise<number> {
    const result = await sendFlightAlert(flightID, {
      title,
      body,
      data,
    });

    return result;
  }
}
