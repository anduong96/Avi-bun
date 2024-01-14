import { Arg, Authorized, Query, Resolver } from 'type-graphql';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { GQL_Aircraft } from '@app/@generated/graphql/models/Aircraft';
import { Selections } from '@app/api/graphql/_decorators/selection.decorator';
import { getOrCreateAircraft } from '@app/services/aircraft/get.or.create.aircraft';
import { GQL_AircraftAmenity } from '@app/@generated/graphql/models/AircraftAmenity';
import { GQL_AircraftSeatMeta } from '@app/@generated/graphql/models/AircraftSeatMeta';

@Resolver(() => GQL_Aircraft)
export class AircraftResolver {
  @Authorized()
  @Query(() => GQL_Aircraft, {
    nullable: true,
  })
  async aircraft(@Arg('tailNumber') tailNumber: string) {
    const result = await getOrCreateAircraft(tailNumber).catch(error => {
      Logger.error(error);
      return null;
    });

    return result;
  }

  @Authorized()
  @Query(() => [GQL_AircraftAmenity])
  async aircraftAmenities(
    @Arg('tailNumber') tailNumber: string,
    @Selections() selections: object,
  ) {
    const result = await prisma.aircraftAmenity.findMany({
      select: selections,
      where: {
        aircraftTailNumber: tailNumber,
      },
    });

    return result;
  }

  @Authorized()
  @Query(() => [GQL_AircraftSeatMeta])
  async aircraftSeatMeta(
    @Arg('tailNumber') tailNumber: string,
    @Selections() selections: object,
  ) {
    const result = await prisma.aircraftSeatMeta.findMany({
      select: selections,
      where: {
        aircraftTailNumber: tailNumber,
      },
    });

    return result;
  }
}
