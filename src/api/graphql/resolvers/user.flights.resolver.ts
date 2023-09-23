import { Authorized, Query, Resolver } from 'type-graphql';

import { GQL_UserFlight } from '@app/@generated/graphql/models/UserFlight';

@Resolver(() => GQL_UserFlight)
export class UserFlightResolver {
  @Authorized()
  @Query(() => [GQL_UserFlight])
  userFlights() {}

  @Authorized()
  @Query(() => [Number])
  userHasFlights() {}

  @Authorized()
  @Query(() => [GQL_UserFlight])
  userActiveFlights() {}
}
