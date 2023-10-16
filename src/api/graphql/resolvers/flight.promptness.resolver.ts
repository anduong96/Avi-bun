import { Arg, Authorized, Query, Resolver } from 'type-graphql';

import { getFlightPromptness } from '@app/services/flight/get.flight.promptness';
import { GQL_FlightPromptness } from '@app/@generated/graphql/models/FlightPromptness';

@Resolver(() => GQL_FlightPromptness)
export class FlightPromptnessResolver {
  @Authorized()
  @Query(() => GQL_FlightPromptness)
  async flightPromptness(@Arg('flightID') flightID: string) {
    const result = await getFlightPromptness(flightID);
    return result;
  }
}
