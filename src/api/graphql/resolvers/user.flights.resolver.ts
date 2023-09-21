import { Query, Resolver } from 'type-graphql';

import { GQL_UserFlight } from '@app/@generated/graphql/models/UserFlight';

@Resolver(() => GQL_UserFlight)
export class UserFlightResolver {
  @Query(() => [GQL_UserFlight])
  userFlights() {}
}
