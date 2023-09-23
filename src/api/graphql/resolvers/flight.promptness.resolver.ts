import { GQL_FlightPromptness } from '@app/@generated/graphql/models/FlightPromptness';
import { getFlightPromptness } from '@app/services/flight/get.flight.promptness';
import { Arg, Authorized, Query, Resolver } from 'type-graphql';

@Resolver(() => GQL_FlightPromptness)
export class FlightPromptnessResolver {
  @Authorized()
  @Query(() => GQL_FlightPromptness)
  async flightPromptness(@Arg('flightID') flightID: string) {
    const result = await getFlightPromptness(flightID);
    return result;
  }
}
