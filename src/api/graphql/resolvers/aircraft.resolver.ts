import { Arg, Authorized, Query, Resolver } from 'type-graphql';

import { Logger } from '@app/lib/logger';
import { GQL_Aircraft } from '@app/@generated/graphql/models/Aircraft';
import { getOrCreateAircraft } from '@app/services/aircraft/get.or.create.aircraft';

@Resolver(() => GQL_Aircraft)
export class AircraftResolver {
  @Authorized()
  @Query(() => GQL_Aircraft, { nullable: true })
  async aircraft(@Arg('tailNumber') tailNumber: string) {
    const result = await getOrCreateAircraft(tailNumber).catch(error => {
      Logger.error(error);
      return null;
    });

    return result;
  }
}
