import { Arg, Authorized, Query, Resolver } from 'type-graphql';

import { prisma } from '@app/prisma';
import { GQL_AircraftPosition } from '@app/@generated/graphql/models/AircraftPosition';

@Resolver(() => GQL_AircraftPosition)
export class AircraftPositionResolver {
  @Authorized()
  @Query(() => GQL_AircraftPosition, { nullable: true })
  async aircraftPosition(@Arg('aircraftID') aircraftID: number) {
    const position = await prisma.aircraftPosition.findFirst({
      orderBy: {
        updatedAt: 'desc',
      },
      take: 1,
      where: {
        aircraftID,
      },
    });

    return position;
  }
}
